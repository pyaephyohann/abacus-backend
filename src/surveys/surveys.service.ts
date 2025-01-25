import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { PrismaService } from 'src/prisma.service';
import {
  UserMultipleFeedBacksDto,
  UserSingleFeedBackDto,
} from './dto/user-feedback.dto';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async userSingleFeedBack(userSingleFeedBackDto: UserSingleFeedBackDto) {
    try {
      const { userId, questionId, answerTitle } = userSingleFeedBackDto;
      const user = await this.prisma.abacusUsers.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User not found!!');
      const question = await this.prisma.surveyQuestions.findUnique({
        where: {
          id: questionId,
        },
      });
      if (!question) throw new NotFoundException('Survey Question not found!!');

      const existingFeedback = await this.prisma.surveyUserResponses.findFirst({
        where: {
          userId,
          questionId,
        },
      });

      if (existingFeedback) {
        const updatedFeedback = await this.prisma.surveyUserResponses.update({
          where: {
            id: existingFeedback.id,
          },
          data: {
            answerTitle,
          },
        });
        return {
          success: true,
          datas: {
            updatedFeedback,
          },
          message: 'Updated user single feedback successfully!!',
        };
      }

      const newFeedback = await this.prisma.surveyUserResponses.create({
        data: {
          userId,
          questionId,
          answerTitle,
        },
      });
      return {
        success: true,
        datas: {
          newFeedback,
        },
        message: 'Saved user single feedback successfully!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Oops! Cannot save user single feedback at this moment!');
    }
  }

  async userMultipleFeedBacks(
    userMultipleFeedBacksDto: UserMultipleFeedBacksDto,
  ) {
    try {
      const { userId, questionId, answers } = userMultipleFeedBacksDto;
      const user = await this.prisma.abacusUsers.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User not found!!');
      const question = await this.prisma.surveyQuestions.findUnique({
        where: {
          id: questionId,
        },
      });
      if (!question) throw new NotFoundException('Survey Question not found!!');

      await this.prisma.surveyUserResponses.deleteMany({
        where: {
          userId,
          questionId,
        },
      });

      const userFeedbacks = answers.map((answer) => {
        return { userId, questionId, answerTitle: answer };
      });

      await this.prisma.surveyUserResponses.createMany({
        data: userFeedbacks,
      });

      const newFeedBacks = await this.prisma.surveyUserResponses.findMany({
        where: {
          userId: userId,
          questionId: questionId,
          answerTitle: {
            in: answers,
          },
        },
      });
      return {
        success: true,
        datas: {
          newFeedBacks,
        },
        message: 'Saved user multiple feedbacks successfully!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error(
        'Oops! Cannot save user multiple feedbacks at this moment!',
      );
    }
  }

  async getAllSurveys() {
    try {
      const surveyQuestions = await this.prisma.surveyQuestions.findMany({
        include: { answers: true },
      });

      const response = {};

      if (!surveyQuestions.length) {
        // create default survey one
        const newSurveyQuestionOne = await this.prisma.surveyQuestions.create({
          data: {
            title: 'ပေသီးသင်္ချာကိုအရင်ကကြားဖူးပါသလား။',
            type: 'SINGLE_CHOICE',
          },
        });

        const createdAnswerOne = [
          'မကြားဖူးပါ',
          'ကြားဖူးပါတယ်။',
          'ပေသီးသင်္ချာတွက်ဖူးပါတယ်။',
        ].map((answer) =>
          this.prisma.surveyAnswers.create({
            data: {
              title: answer,
              questionId: newSurveyQuestionOne.id,
            },
          }),
        );

        await Promise.all(createdAnswerOne);

        const newSurveyQuestionTwo = await this.prisma.surveyQuestions.create({
          data: {
            title: 'တစ်နေ့ကို ဘယ်လောက်လေ့ကျင့်ချင်ပါသလဲ။',
            type: 'SINGLE_CHOICE',
          },
        });

        const createdAnswerTwo = ['(၁၅) မိနစ်', '(၃၀) မိနစ်', '(၁) နာရီ'].map(
          (answer) =>
            this.prisma.surveyAnswers.create({
              data: {
                title: answer,
                questionId: newSurveyQuestionTwo.id,
              },
            }),
        );

        await Promise.all(createdAnswerTwo);

        const newSurveyQuestionThree = await this.prisma.surveyQuestions.create(
          {
            data: {
              title: 'စိတ်ဝင်စားတဲ့အရာတွေက ဘာတွေဖြစ်မလဲ။',
              type: 'MULTIPLE_CHOICE',
            },
          },
        );

        const createdAnswerThree = [
          'စာဖတ်',
          'ဂိမ်းကစား',
          'တီဗွီကြည့်',
          'သင်္ချာတွက်',
          'အင်္ဂလိပ်စာ',
          'သီချင်းဆို',
          'ရေကူး',
          'ဘောလုံးကန်',
          'ပန်းချီဆွဲ',
          'ဂီတတူရိယာ',
          'မုန့်စား',
          'တခြား',
        ].map((answer) =>
          this.prisma.surveyAnswers.create({
            data: {
              title: answer,
              questionId: newSurveyQuestionThree.id,
            },
          }),
        );
        await Promise.all(createdAnswerThree);

        const createdSurveyQuestions =
          await this.prisma.surveyQuestions.findMany({
            include: { answers: true },
          });

        createdSurveyQuestions.forEach((question, index) => {
          const surveyKey = `survey${index + 1}`;
          response[surveyKey] = {
            question: question.title,
            answers: question.answers.map((answer) => answer.title),
          };
        });
      }

      surveyQuestions.forEach((question, index) => {
        const surveyKey = `survey${index + 1}`;
        response[surveyKey] = {
          question: question.title,
          answers: question.answers.map((answer) => answer.title),
        };
      });

      return {
        success: true,
        datas: {
          surveys: response,
        },
      };
    } catch (error) {
      throw new Error('Cannot get the surveys at this time!!');
    }
  }

  async createSurvey(createSurveyDto: CreateSurveyDto) {
    try {
      const { question, type, answers } = createSurveyDto;

      const newSurveyQuestion = await this.prisma.surveyQuestions.create({
        data: {
          title: question,
          type,
        },
      });

      const createAnswerPromises = answers.map((answer) =>
        this.prisma.surveyAnswers.create({
          data: {
            title: answer,
            questionId: newSurveyQuestion.id,
          },
        }),
      );

      await Promise.all(createAnswerPromises);

      const newSurveyAnswers = await this.prisma.surveyAnswers.findMany({
        where: {
          questionId: newSurveyQuestion.id,
        },
      });

      return {
        success: true,
        message: 'New Survey Created Successfully!!',
        datas: {
          question: newSurveyQuestion,
          answers: newSurveyAnswers,
        },
      };
    } catch (error) {
      throw new Error('Cannot create survey at this time!!');
    }
  }
}
