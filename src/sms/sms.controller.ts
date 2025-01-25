import { Body, Controller, Post, Query, ValidationPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsVerifyDto } from './dto/sms-verify.dto';

@Controller('api/sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  // Send Sms

  @Post('send-sms')
  sendSms(@Query('phoneNumber') phoneNumber: string) {
    return this.smsService.sendSms(phoneNumber);
  }

  // Verify Sms

  @Post('verify-sms')
  verifySms(@Body(ValidationPipe) smsVerifyDto: SmsVerifyDto) {
    return this.smsService.verifySms(smsVerifyDto);
  }
}
