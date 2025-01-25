import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsArray } from 'class-validator';

export class UserSingleFeedBackDto {
  @ApiProperty({
    description: 'UserId who answer the survey',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Survey Question Id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({
    description: 'Survey Answer Title',
    example: 'ကြားဖူးပါတယ်။',
  })
  @IsString()
  @IsNotEmpty()
  answerTitle: string;
}

export class UserMultipleFeedBacksDto {
  @ApiProperty({
    description: 'UserId who answer the survey',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Survey Question Id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @ApiProperty({
    description: 'Survey Answers',
    example: ['စာဖတ်', 'ဂိမ်းကစား', 'ရေကူး'],
  })
  @IsArray()
  @IsNotEmpty()
  answers: string[];
}
