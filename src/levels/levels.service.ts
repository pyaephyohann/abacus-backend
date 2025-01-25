import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateLevelDto } from './dto/update-level.dto';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  async createNewLevel(createLevelDto: CreateLevelDto) {
    try {
      const { digit, row, name, description, isActive } = createLevelDto;

      const levels = await this.prisma.levels.findMany();

      // await Promise.all(levels);

      const newLevel = await this.prisma.levels.create({
        data: {
          digit,
          row,
          name,
          description,
          order: levels.length + 1,
          isActive,
        },
      });

      return {
        success: true,
        datas: {
          newLevel,
        },
        message: 'New Level created successfully!!',
      };
    } catch (error) {
      throw new Error('Cannot create new level at this time!!');
    }
  }

  async updateLevel(levelId: number, updateLevelDto: UpdateLevelDto) {
    try {
      const { row, digit, isActive, name, description } = updateLevelDto;

      const level = await this.prisma.levels.findUnique({
        where: {
          id: levelId,
        },
      });

      if (!level) throw new NotFoundException('Level not found!');
      const updatedLevel = await this.prisma.levels.update({
        where: {
          id: levelId,
        },
        data: {
          row: row ? row : level.row,
          digit: digit ? digit : level.digit,
          isActive: isActive !== undefined ? isActive : level.isActive,
          name: name ? name : level.name,
          description: description ? description : level.description,
        },
      });

      return {
        success: true,
        datas: {
          updatedLevel,
        },
        message: 'Level updated successfully!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Cannot Update level at this time!');
    }
  }

  async getAllLevels() {
    try {
      const levels = await this.prisma.levels.findMany();
      return {
        success: true,
        datas: {
          levels,
        },
        message: 'All levels fetched successfully!!',
      };
    } catch (error) {
      throw new Error('Cannot get the levels at this time!!');
    }
  }

  async deleteLevel(id: number) {
    try {
      const level = await this.prisma.levels.findUnique({
        where: {
          id,
        },
      });

      if (!level) throw new NotFoundException('Level not found!!');

      const deletedLevel = await this.prisma.levels.update({
        where: {
          id,
        },
        data: {
          isArchived: true,
        },
      });

      return {
        success: true,
        data: {
          deletedLevel,
        },
        message: 'Level Deleted Successfully!!',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Cannot Delete level at this time!');
    }
  }
}
