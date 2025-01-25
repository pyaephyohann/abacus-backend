import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SaveQuestionSettingDto } from './dto/save-question-setting.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(createQuestionDto: CreateQuestionDto) {
    try {
      const { userId, breakTime, row, digit, showType, speed, round } =
        createQuestionDto;

      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User does not exist');

      // create new question setting
      const newQuestionSetting = await this.prisma.questionSetting.create({
        data: {
          userId,
          breakTime,
          row,
          digit,
          showType,
          speed,
          round,
        },
      });

      const generateRandomNumber = (digit: number) => {
        const min = Math.pow(10, digit - 1);
        const max = Math.pow(10, digit) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      const generateRandomNumberArray = (row: number, digit: number) => {
        return Array.from({ length: row }, () => generateRandomNumber(digit));
      };

      const calculateTotal = (array: number[]) => {
        return array.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0,
        );
      };

      // create question with for loop based on round

      for (let i = 0; i < round; i++) {
        const generatedRandomQuestion = generateRandomNumberArray(row, digit);
        const answer = calculateTotal(generatedRandomQuestion);
        await this.prisma.questions.create({
          data: {
            questionSettingId: newQuestionSetting.id,
            question: String(generatedRandomQuestion),
            answer,
            roundNumber: i + 1,
          },
        });
      }
      const createdQuestions = await this.prisma.questions.findMany({
        where: {
          questionSettingId: newQuestionSetting.id,
        },
      });

      const filteredQuestions = createdQuestions.map((question) => {
        return {
          id: question.id,
          questionSettingId: question.questionSettingId,
          question: question.question,
          answer: question.answer,
          roundNumber: question.roundNumber,
        };
      });

      return {
        success: true,
        datas: {
          row: newQuestionSetting.row,
          digit: newQuestionSetting.digit,
          breakTime: newQuestionSetting.breakTime,
          showType: newQuestionSetting.showType,
          speed: newQuestionSetting.speed,
          round: newQuestionSetting.round,
          questions: filteredQuestions,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Oops! Cannot create questions at this moment!');
    }
  }

  async getTotalScore(updateQuestionDto: UpdateQuestionDto) {
    try {
      const { questionSettingId, datas } = updateQuestionDto;

      // Check question setting exist or not in database

      const questionSetting = await this.prisma.questionSetting.findFirst({
        where: {
          id: questionSettingId,
        },
      });
      if (!questionSetting)
        throw new NotFoundException('Question setting does not exist!');

      // update question with user answers by looping

      const updateUserAnswerPromises = datas.map(async (data) => {
        // check question exist or not in database

        const question = await this.prisma.questions.findFirst({
          where: {
            id: data.questionId,
          },
        });

        if (!question)
          throw new NotFoundException('Some Questions does not exist!!');

        // check the question is related to question setting (check Question setting have this question or not)

        if (question.questionSettingId !== questionSettingId)
          throw new NotAcceptableException(
            'Question setting does not have this question!!',
          );

        // update the question with user answer

        await this.prisma.questions.update({
          where: {
            id: data.questionId,
          },
          data: {
            userAnswer: data.userAnswer,
            startTime: data.startTime,
            endTime: data.endTime,
            isCorrect: question.answer === data.userAnswer ? true : false,
          },
        });
      });

      await Promise.all(updateUserAnswerPromises);

      // update question setting to inform that the question setting is completed answered

      await this.prisma.questionSetting.update({
        where: {
          id: questionSettingId,
        },
        data: {
          isComplete: true,
        },
      });

      // get total score

      const totalScore = await this.prisma.questions.findMany({
        where: {
          questionSettingId,
          isCorrect: true,
        },
      });

      return {
        success: true,
        datas: {
          totalScore: totalScore.length,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      }
      throw new Error('Cannot Get Total Score at this time!');
    }
  }

  async saveQuestionSetting(saveQuestionSettingDto: SaveQuestionSettingDto) {
    try {
      const { userId, breakTime, row, digit, showType, speed, round, name } =
        saveQuestionSettingDto;
      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User does not exist');

      // create new question setting
      const newQuestionSetting = await this.prisma.questionSetting.create({
        data: {
          userId,
          breakTime,
          row,
          digit,
          showType,
          speed,
          round,
        },
      });

      const newSavedQuestionSetting =
        await this.prisma.savedQuestionSettings.create({
          data: {
            questionSettingId: newQuestionSetting.id,
            name,
          },
        });
      return {
        success: true,
        datas: {
          id: newSavedQuestionSetting.id,
          name,
          questionSetting: newQuestionSetting,
        },
        message: 'Created New Question Setting and saved successfully!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Oops! Cannot save question setting at this moment!');
    }
  }

  async getSavedQuestionSetting(userId: number) {
    try {
      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User does not exist');

      const questionSettingsByUserId =
        await this.prisma.questionSetting.findMany({
          where: {
            userId,
          },
        });

      const questionSettingIdsByUserId = questionSettingsByUserId.map(
        (item) => item.id,
      );

      const savedQuestionSettingsByQuestionSettingIds =
        await this.prisma.savedQuestionSettings.findMany({
          where: {
            questionSettingId: {
              in: questionSettingIdsByUserId,
            },
          },
        });

      const response = savedQuestionSettingsByQuestionSettingIds.map(
        (savedSetting) => {
          const questionSetting = questionSettingsByUserId.find(
            (qs) => qs.id === savedSetting.questionSettingId,
          );
          return {
            id: savedSetting.id,
            name: savedSetting.name,
            questionSetting: questionSetting,
          };
        },
      );

      return {
        succes: true,
        datas: response,
        message: 'Successfully Fetched all the saved question settings!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error(
        'Oops! Cannot get saved question settings at this moment!',
      );
    }
  }
}
