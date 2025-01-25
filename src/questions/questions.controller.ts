import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SaveQuestionSettingDto } from './dto/save-question-setting.dto';

@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-questions')
  createQuestion(@Body(ValidationPipe) createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-total-score')
  getTotalScore(@Body(ValidationPipe) updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.getTotalScore(updateQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-question-setting')
  saveQuestionSetting(
    @Body(ValidationPipe) saveQuestionSettingDto: SaveQuestionSettingDto,
  ) {
    return this.questionsService.saveQuestionSetting(saveQuestionSettingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-saved-question-settings/:userId')
  getSavedQuestionSetting(@Param('userId', ParseIntPipe) userId: number) {
    return this.questionsService.getSavedQuestionSetting(userId);
  }
}
