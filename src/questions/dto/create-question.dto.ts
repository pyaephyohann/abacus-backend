import { ApiProperty } from '@nestjs/swagger';
import { QuestionShowType } from '@prisma/client';
import { IsNumber, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Abacus User Id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Break time after one question',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  breakTime: number;

  @ApiProperty({
    description: 'Question rows',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  row: number;

  @ApiProperty({
    description: 'Question digit',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  digit: number;

  @ApiProperty({
    description: 'Question Show Type',
    example: 'CALCULATION or LISTENING or FLASHCARD',
  })
  @IsEnum(QuestionShowType)
  @IsNotEmpty()
  showType: QuestionShowType;

  @ApiProperty({
    description: 'Question Show speed',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  speed: number;

  @ApiProperty({
    description: 'Number of questions',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  round: number;
}
