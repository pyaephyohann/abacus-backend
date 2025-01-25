import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SmsVerifyDto {
  @ApiProperty({
    description: 'Phone Number to verify',
    example: '09757814509',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Otp Code from user to verify',
    example: 4098,
  })
  @IsNotEmpty()
  @IsNumber()
  otpCode: number;
}
