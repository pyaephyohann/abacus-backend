import { Controller, Get, Post, Body } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import {
  UserMultipleFeedBacksDto,
  UserSingleFeedBackDto,
} from './dto/user-feedback.dto';

@Controller('api/surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post('user-single-feedback')
  userSingleFeedBack(@Body() userSingleFeedBackDto: UserSingleFeedBackDto) {
    return this.surveysService.userSingleFeedBack(userSingleFeedBackDto);
  }

  @Post('user-multiple-feedback')
  userMultipleFeedBacks(
    @Body() userMultipleFeedBacksDto: UserMultipleFeedBacksDto,
  ) {
    return this.surveysService.userMultipleFeedBacks(userMultipleFeedBacksDto);
  }

  @Get('get-surveys')
  getAllSurveys() {
    return this.surveysService.getAllSurveys();
  }

  @Post('create-new-survey')
  createSurvey(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.createSurvey(createSurveyDto);
  }
}
