/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signIn.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/Users/dto/createUser.dto';
import { User } from 'src/Users/entity/user.entity';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AssignPasswordDto } from './dto/assignPassword.dto';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './enum/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './roles.guard';
import { ChatGateway } from 'src/gateway/chat.gateway';

const API_URL = process.env.FRONT_URL;
console.log('API_URL:', API_URL);

@Controller('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post('signIn')
  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: 200,
    description: 'Return token',
    type: String,
  })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() credential: SignInAuthDto) {
    try {
      return this.authService.signIn(credential);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signUp')
  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: 201,
    description: 'Return token',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Error message', type: String })
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return this.authService.signUp(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() data: any) {
    const email = data.email;
    console.log('email:', email);

    try {
      return this.authService.forgotPassword(email);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin, Role.User, Role.Vip)
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Put(':id/assign-password')
  @HttpCode(HttpStatus.OK)
  async assignPassword(
    @Body() password: AssignPasswordDto,
    @Param('id') id: number,
  ) {
    try {
      return this.authService.assignPassword(password, id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() passwords: ChangePasswordDto,
    @Param('id') id: number,
  ) {
    try {
      return this.authService.changePassword(passwords, id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const response = await this.authService.signInOauth(req.user);
    console.log(response.accessToken);
    res.redirect(`${API_URL}/login?token=${response.accessToken}`);
  }
}
