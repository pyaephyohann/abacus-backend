import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UserAnswer {
  @ApiProperty({
    description: 'User Answer',
    example: 268,
  })
  @IsNotEmpty()
  @IsNumber()
  userAnswer: number;

  @ApiProperty({
    description: 'QuestionId',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @ApiProperty({
    description: 'Start Time when the question is showed',
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'End Time when user answer the question',
    example: new Date(),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;
}

export class UpdateQuestionDto {
  @ApiProperty({
    description: 'Array of user answers',
    type: [UserAnswer],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswer)
  datas: UserAnswer[];

  @ApiProperty({
    description: 'Question Setting Id that user take',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  questionSettingId: number;
}
