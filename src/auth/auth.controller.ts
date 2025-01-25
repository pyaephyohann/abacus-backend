import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { NewPasswordDto } from './dto/new-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Sign In

  @Post('sign-in')
  signIn(@Body(ValidationPipe) signInUserDto: SignInUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  // Sign Up

  @Post('sign-up')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('sign-out/:userId')
  signOut(@Param('userId', ParseIntPipe) userId: number) {
    return this.authService.signOut(userId);
  }

  @Post('forgot-password')
  forgotPassword(@Query('usernameOrPhone') usernameOrPhone: string) {
    return this.authService.forgotPassword(usernameOrPhone);
  }

  @Put('new-password')
  newPassword(@Body(ValidationPipe) newPasswordDto: NewPasswordDto) {
    return this.authService.newPassword(newPasswordDto);
  }
}
