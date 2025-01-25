import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AbacusUsers } from '@prisma/client';
import { config } from 'src/config/config';
import { NewPasswordDto } from './dto/new-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const { username, phone, email, password } = createUserDto;
      const isPhoneNumberAlreadyExisted =
        await this.prisma.abacusUsers.findFirst({
          where: {
            phone,
          },
        });

      const isEmailAlreadyExisted = await this.prisma.abacusUsers.findFirst({
        where: {
          email,
        },
      });

      const isUsernameAlreadyExisted = await this.prisma.abacusUsers.findFirst({
        where: {
          username,
        },
      });

      const isUserExisted =
        !!isPhoneNumberAlreadyExisted ||
        !!isEmailAlreadyExisted ||
        !!isUsernameAlreadyExisted;

      if (isUserExisted)
        throw new ConflictException({
          phone: {
            statusCode: isPhoneNumberAlreadyExisted ? 409 : 200,
            message: isPhoneNumberAlreadyExisted
              ? 'Your phone number is already in use'
              : 'Your phone number is available',
          },
          email: {
            statusCode: isEmailAlreadyExisted ? 409 : 200,
            message: isEmailAlreadyExisted
              ? 'Your email is already in use'
              : 'Your email is available',
          },
          name: {
            statusCode: isUsernameAlreadyExisted ? 409 : 200,
            message: isUsernameAlreadyExisted
              ? 'Your name is already in use'
              : 'Your name is available',
          },
        });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.prisma.abacusUsers.create({
        data: {
          username,
          phone,
          email,
          password: hashedPassword,
        },
      });
      delete newUser.password;
      return {
        success: true,
        message:
          'Successfully created! Verfiy with OTP to ativate your account',
        datas: { user: newUser },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Oops! Cannot register at this moment!');
    }
  }

  async signIn(signInUserDto: SignInUserDto) {
    try {
      const { usernameOrPhone, password } = signInUserDto;

      const isPhoneNumber = Number(usernameOrPhone);
      let user: AbacusUsers;

      if (isPhoneNumber) {
        user = await this.prisma.abacusUsers.findFirst({
          where: {
            phone: usernameOrPhone,
          },
        });
      } else {
        user = await this.prisma.abacusUsers.findFirst({
          where: {
            username: usernameOrPhone,
          },
        });
      }

      if (!user)
        throw new NotFoundException({
          usernameOrPhone: {
            statusCode: 404,
            message: 'User not found!',
          },
          password: {
            statusCode: 200,
            message: '',
          },
        });
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword)
        throw new UnauthorizedException({
          usernameOrPhone: {
            statusCode: 200,
            message: 'UserNameOrPhone exists',
          },
          password: {
            statusCode: 401,
            message: 'Invalid Password!',
          },
        });
      if (user.accessToken)
        throw new UnauthorizedException(
          'You are already logged in on another device. Please sign out first before attempting to log in again',
        );
      delete user.password;
      const accessToken = this.jwtService.sign(user);
      await this.prisma.abacusUsers.update({
        where: {
          id: user.id,
        },
        data: {
          accessToken,
        },
      });
      return {
        success: true,
        datas: {
          accessToken,
          user,
        },
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Server error');
    }
  }

  async signOut(userId: number) {
    try {
      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) throw new NotFoundException('User not found!');
      await this.prisma.abacusUsers.update({
        where: {
          id: userId,
        },
        data: {
          accessToken: null,
        },
      });
      return {
        success: true,
        message: 'User logged out successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Server error');
    }
  }

  async forgotPassword(usernameOrPhone: string) {
    try {
      if (!usernameOrPhone)
        throw new BadRequestException('Username or Phone is required!');
      const isPhoneNumber = Number(usernameOrPhone);
      let user: AbacusUsers;

      if (isPhoneNumber) {
        user = await this.prisma.abacusUsers.findFirst({
          where: {
            phone: usernameOrPhone,
          },
        });
      } else {
        user = await this.prisma.abacusUsers.findFirst({
          where: {
            username: usernameOrPhone,
          },
        });
      }

      if (!user) throw new NotFoundException('User not found!');

      // send sms

      const otp = Math.floor(1000 + Math.random() * 9000);

      const smsData = {
        to: user.phone,
        message: `${otp} is your verification code for Fatty application login.`,
        sender: 'Fatty',
      };

      const currentTime = new Date();
      const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // Subtract 1 hour

      let otpSendTimes: string[] = (user.otpSendTimes as string[]) || [];

      // Convert strings to Date objects and filter out send times older than one hour
      otpSendTimes = otpSendTimes
        .map((time) => new Date(time))
        .filter((time) => time >= oneHourAgo)
        .map((time) => time.toISOString());

      const maxOtpLimit = 5; // Maximum OTPs allowed in an hour

      if (otpSendTimes.length >= maxOtpLimit) {
        throw new NotAcceptableException(
          'OTP limit exceeded for this hour. Please try again in one hour.',
        );
      }

      otpSendTimes.push(currentTime.toISOString());

      const response = await fetch(config.smsPohBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.smsPohToken}`,
        },
        body: JSON.stringify(smsData),
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      await this.prisma.abacusUsers.update({
        where: {
          phone: user.phone,
        },
        data: {
          otpCode: otp,
          otpSendTimes,
          otpCreatedAt: currentTime.toISOString(),
        },
      });

      return {
        success: true,
        message: 'OTP sent successfully',
        datas: {
          otpCode: otp,
          phoneNumber: user.phone,
        },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error;
      }
      throw new Error('Cannot use this feature at this time!');
    }
  }

  async newPassword(newPasswordDto: NewPasswordDto) {
    try {
      const { phoneNumber, newPassword } = newPasswordDto;
      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          phone: phoneNumber,
        },
      });
      if (!user) throw new NotFoundException('User not found!');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.abacusUsers.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashedPassword,
        },
      });
      return {
        success: true,
        message: 'Password changed successfully!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Cannot change password at this time!');
    }
  }
}
