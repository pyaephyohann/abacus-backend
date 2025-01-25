import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { config } from '../config/config';
import { SmsVerifyDto } from './dto/sms-verify.dto';

@Injectable()
export class SmsService {
  constructor(private prisma: PrismaService) {}

  async sendSms(phoneNumber: string) {
    try {
      if (!phoneNumber)
        throw new BadRequestException('Phone number is required!');
      const otp = Math.floor(1000 + Math.random() * 9000);

      const smsData = {
        to: phoneNumber,
        message: `${otp} is your verification code for Fatty application login.`,
        sender: 'Fatty',
      };

      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          phone: phoneNumber,
        },
      });

      if (!user) {
        throw new NotFoundException('Wrong Phone Number');
      }

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

      // Append current time to send times
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
          phone: phoneNumber,
        },
        data: {
          otpCode: otp,
          otpSendTimes,
          otpCreatedAt: currentTime.toISOString(),
        },
      });

      return {
        message: 'OTP sent successfully',
        datas: { otpCode: otp, phoneNumber: user.phone },
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof NotAcceptableException
      ) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Server error');
    }
  }

  async verifySms(smsverifyDto: SmsVerifyDto) {
    try {
      const user = await this.prisma.abacusUsers.findFirst({
        where: {
          phone: smsverifyDto.phoneNumber,
        },
      });

      if (!user) throw new NotFoundException('Phone Number not found');

      const otpCreatedAt = new Date(user.otpCreatedAt);
      const currentTime = new Date();
      const otpExpirationTime = new Date(
        otpCreatedAt.getTime() + 1 * 60 * 1000,
      );

      if (currentTime > otpExpirationTime) {
        throw new UnauthorizedException('OTP has expired');
      }

      const isVerified = user.otpCode === smsverifyDto.otpCode;
      if (!isVerified) throw new UnauthorizedException('Invalid OTP');

      return {
        success: true,
        datas: {
          valid: true,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // Rethrow the specific exceptions
      }
      throw new Error('Server error');
    }
  }
}
