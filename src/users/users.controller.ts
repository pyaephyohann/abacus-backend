import { Controller, Body, ValidationPipe, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserProfilePhotoDto } from './dto/update-user-profile-photo.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('upload-profile-photo')
  updateProfileUrl(
    @Body(ValidationPipe) updateProfilePhotoDto: UpdateUserProfilePhotoDto,
  ) {
    return this.usersService.updateProfileUrl(updateProfilePhotoDto);
  }
}
