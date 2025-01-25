import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class CreateLevelDto {
  @ApiProperty({
    description: 'Digit number for level',
    example: 3,
  })
  @IsNumber()
  @IsNotEmpty()
  digit: number;

  @ApiProperty({
    description: 'Row number for level',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  row: number;

  @ApiProperty({
    description: 'Active or not for level showing to users',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty({
    description: 'Name for level',
    example: 'Level 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Short message for level',
    example: 'Practice the digit 3 on the abacus with 5 rows of exercises.',
  })
  description?: string;
}
