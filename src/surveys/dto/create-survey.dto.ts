import { ApiProperty } from '@nestjs/swagger';
import { SurveyQuestionType } from '@prisma/client';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateSurveyDto {
  @ApiProperty({
    description: 'Survey question name for account set up',
    example: 'ပေသီးသင်္ချာကိုအရင်ကကြားဖူးပါသလား။',
  })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    description: 'Survey answers for survey questions for account set up',
    example: ['မကြားဖူးပါ', 'ကြားဖူးပါတယ်။', 'ပေသီးသင်္ချာတွက်ဖူးပါတယ်။'],
  })
  @IsString()
  @IsNotEmpty()
  answers: string[];

  @ApiProperty({
    description: 'Survey Question Type',
    example: 'SINGLE_CHOICE MULTIPLE_CHOICE',
  })
  @IsEnum(SurveyQuestionType)
  @IsNotEmpty()
  type: SurveyQuestionType;
}
