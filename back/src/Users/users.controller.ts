/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.services';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { ModifyUserDto } from './dto/modifyUser.dto';
import { Role } from 'src/Auth/enum/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/Auth/roles.guard';
import { BanUserDto } from './dto/banUser.dto';
import { UserResponseDto } from 'src/users/dto/responseUser.dto';
import { plainToClass } from 'class-transformer';
import { ChatGateway } from 'src/gateway/chat.gateway';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users', type: [User] })
  @ApiResponse({ status: 404, description: 'No users found' })
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<User[]> {
    try {
      return this.userService.getUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('total-users')
  @HttpCode(HttpStatus.OK)
  async getTotalUsers() {
    try {
      return await this.userService.getTotalUsers();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('last-user')
  @HttpCode(HttpStatus.OK)
  async getLastUser(): Promise<UserResponseDto> {
    try {
      const user = await this.userService.getLastUser();
      return plainToClass(UserResponseDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get('email')
  async getUserByEmail(@Body() data: any): Promise<UserResponseDto> {
    const email = data.email;
    console.log('email:', email);
    try {
      return await this.userService.getUserByEmail(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post('favorite-products/:productId')
  async addFavoriteProduct(@Param('productId') productId: number, @Req() req) {
    const userId = req.user.userId;
    Number(productId);
    try {
      const favorite = await this.userService.addFavoriteProduct(
        userId,
        productId,
      );
      this.chatGateway.server.emit('addFavoriteProduct', favorite);
      return { message: 'Product added to favorites', favorite };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete('favorite-products/:productId')
  async deleteFavoriteProduct(
    @Param('productId') productId: number,
    @Req() req,
  ) {
    const userId = req.user.userId;
    Number(productId);
    try {
      const favorite = await this.userService.deleteFavoriteProduct(
        userId,
        productId,
      );
      this.chatGateway.server.emit('deleteFavoriteProduct', favorite);
      return { message: 'Product deleted from favorites', favorite };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put('modify/:id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User updated', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Body() modifyUserDto: ModifyUserDto,
    @Param('id') id: number,
  ) {
    const userId = id;
    console.log('userId:', userId);
    console.log('modifyUserDto:', modifyUserDto);
    try {
      const user = await this.userService.updateUser(userId, modifyUserDto);
      this.chatGateway.server.emit('updateUser', user);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('create')
  @ApiOperation({ summary: 'Create user ' })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/ban')
  @ApiOperation({ summary: 'Ban user by id' })
  @ApiResponse({ status: 200, description: 'User banned', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async banUser(@Param('id') id: number, @Body() data: BanUserDto) {
    try {
      return await this.userService.banUser(id, data);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/unban')
  @ApiOperation({ summary: 'Unban user by id' })
  @ApiResponse({ status: 200, description: 'User Unbanned', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async unbanUser(@Param('id') id: number) {
    try {
      return await this.userService.unbanUser(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'Return user by id', type: User })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: number): Promise<UserResponseDto> {
    Number(id);
    try {
      const user = await this.userService.getOneUser(id);
      return plainToClass(UserResponseDto, user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
