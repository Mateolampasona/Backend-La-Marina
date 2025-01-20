import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/Auth/enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { CreateDiscountDto, modifyDiscountDto } from './dto/createDiscount.dto';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createDiscount(@Body() createDiscountDto: CreateDiscountDto) {
    try {
      return await this.discountService.createDiscount(createDiscountDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteDiscount(@Param('id') id: number) {
    try {
      return await this.discountService.deleteDiscount(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllDiscount() {
    try {
      return await this.discountService.getAllDiscount();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  async updateDiscount(
    @Body() modifyDiscountDto: modifyDiscountDto,
    @Param('id') id: number,
  ) {
    try {
      return await this.discountService.updateDiscount(modifyDiscountDto, id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('name/:name')
  @HttpCode(HttpStatus.OK)
  async getDiscountByName(@Param('name') name: string) {
    try {
      return await this.discountService.getDiscountByName(name);
    } catch (error) {
      throw new Error(error);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDiscountById(@Param('id') id: number) {
    try {
      return await this.discountService.getDiscountById(id);
    } catch (error) {
      throw new Error(error);
    }
  }
}
