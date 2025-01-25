import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { QuestionsModule } from './questions/questions.module';
import { SurveysModule } from './surveys/surveys.module';
import { FileuploadModule } from './fileupload/fileupload.module';
import { UsersModule } from './users/users.module';
import { LevelsModule } from './levels/levels.module';

@Module({
  imports: [
    AuthModule,
    SmsModule,
    QuestionsModule,
    SurveysModule,
    FileuploadModule,
    UsersModule,
    LevelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
