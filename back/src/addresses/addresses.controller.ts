import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { Role } from 'src/Auth/enum/roles.enum';
import { UpdateAddresDto } from './dto/updateAddres.dto';
import { CreateAddresDto } from './dto/createAddress.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  async getAllAddresses() {
    try {
      return this.addressesService.getAllAddresses();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('addresses-user')
  async getAddressesUser(@Req() req: any) {
    try {
      const user = req.user;
      return this.addressesService.getAddressesUser(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  async getAddressesUserById(@Param('id') id: number) {
    try {
      return this.addressesService.getAddresById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('create')
  async createAddressUser(
    @Req() req: any,
    @Body() createAddresDto: CreateAddresDto,
  ) {
    try {
      const dataUser = req.user;
      return this.addressesService.createAddressUser(dataUser, createAddresDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('modify/:id')
  async updateAddressUser(
    @Param('id') id: number,
    @Req() req: any,
    @Body() updateAddresDto: UpdateAddresDto,
  ) {
    try {
      const dataUser = req.user;
      return this.addressesService.updateAddressUser(
        dataUser,
        id,
        updateAddresDto,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('delete/:id')
  async deleteAddressUser(@Param('id') id: number, @Req() req: any) {
    try {
      const dataUser = req.user;
      return this.addressesService.deleteAddressUser(dataUser, id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
