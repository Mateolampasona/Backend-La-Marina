import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MontService } from './monts.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { Mont } from './entity/mont.entity';

@Controller('Monts')
export class MontController {
  constructor(private readonly montService: MontService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('current')
  async getCurrentMont() {
    try {
      return await this.montService.getCurrentMont();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('update')
  async updateCurrentMontStatistics() {
    try {
      return await this.montService.updateCurrentMontStatistics();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create/:mont')
  async createMont(@Param('mont') mont: string): Promise<Mont> {
    try {
      return await this.montService.createMont(mont);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
