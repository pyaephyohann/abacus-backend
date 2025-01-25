import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class NewPasswordDto {
  @ApiProperty({
    description: 'Phone Number to change password to the user',
    example: '09757814509',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'New Password',
    example: 'Newpassword23@',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Z].*$/, {
    message:
      'Password must start with a capital letter, contain at least one number, and one special character',
  })
  newPassword: string;
}
