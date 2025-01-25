import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Put,
  Param,
  ParseIntPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { LevelsService } from './levels.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('api/levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Post('new-level')
  createNewLevel(@Body(ValidationPipe) createLevelDto: CreateLevelDto) {
    return this.levelsService.createNewLevel(createLevelDto);
  }

  @Put('update-level/:id')
  updateLevel(
    @Param('id', ParseIntPipe) levelId: number,
    @Body(ValidationPipe) updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelsService.updateLevel(levelId, updateLevelDto);
  }

  @Get('get-all-levels')
  getAllLevels() {
    return this.levelsService.getAllLevels();
  }

  @Delete('delete-level/:id')
  deleteLevel(@Param('id', ParseIntPipe) id: number) {
    return this.levelsService.deleteLevel(id);
  }
}
