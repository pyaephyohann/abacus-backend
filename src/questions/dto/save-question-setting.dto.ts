import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './create-question.dto';
import { IsString, IsNotEmpty } from 'class-validator';

export class SaveQuestionSettingDto extends PartialType(CreateQuestionDto) {
  @ApiProperty({
    description: 'Name for saved question setting',
    example: 'File 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
