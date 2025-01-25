import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Abacus User Name',
    example: 'User1',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Abacus User Phone Number',
    example: '09757814509',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Abacus User Email',
    example: 'user1@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Abacus User Password',
    example: 'User1password20@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Z].*$/, {
    message:
      'Password must start with a capital letter, contain at least one number, and one special character',
  })
  password: string;
}
