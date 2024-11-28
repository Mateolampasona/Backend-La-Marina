/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInAuthDto } from './dto/signIn.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/Users/dto/createUser.dto';
import { User } from 'src/Users/entity/user.entity';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      console.log(createUserDto);

      return this.authService.signUp(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
