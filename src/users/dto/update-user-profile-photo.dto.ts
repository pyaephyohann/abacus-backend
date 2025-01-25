import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserProfilePhotoDto {
  @ApiProperty({
    description: 'User Id to change profile photo',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'User profile url from file upload api',
    example:
      'https://storage.googleapis.com/abacus-myanmar.appspot.com/9c783922-ce48-48ed-8b3b-479e615cdd3a-Haruhiko.jpg',
  })
  @IsString()
  @IsNotEmpty()
  assetUrl: string;
}
