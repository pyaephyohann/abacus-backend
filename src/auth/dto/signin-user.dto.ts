import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @ApiProperty({
    description: 'Abacus User Name or Phone',
    example: 'user1 or 09757814509',
  })
  @IsString()
  @IsNotEmpty()
  usernameOrPhone: string;

  @ApiProperty({
    description: 'Abacus user password field',
    example: 'user1password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
