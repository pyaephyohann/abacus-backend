import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserProfilePhotoDto } from './dto/update-user-profile-photo.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfileUrl(updateProfilePhotoDto: UpdateUserProfilePhotoDto) {
    try {
      const { userId, assetUrl } = updateProfilePhotoDto;
      const user = await this.prisma.abacusUsers.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new NotFoundException('User Not Found!!');
      const updatedUser = await this.prisma.abacusUsers.update({
        where: {
          id: userId,
        },
        data: {
          assetUrl,
        },
      });
      delete updatedUser.password;
      return {
        success: true,
        datas: {
          user: updatedUser,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Oops! Cannot update user profile photo at this time');
    }
  }
}
