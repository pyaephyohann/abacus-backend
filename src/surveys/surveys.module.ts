import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService, PrismaService],
})
export class SurveysModule {}
