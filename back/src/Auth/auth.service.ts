import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInAuthDto } from './dto/signIn.dto';

import { UsersService } from 'src/Users/users.services';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/Users/dto/createUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Users/entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(credential: SignInAuthDto) {
    const dbUser = await this.userService.getUserByEmail(credential.email);
    if (!dbUser) {
      throw new NotFoundException(
        `User with email ${credential.email} not found`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      credential.password,
      dbUser.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = {
      username: dbUser.email,
      sub: dbUser.userId,
      role: dbUser.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signUp(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const dbUser = await this.userService.getUserByEmail(createUserDto.email);
    if (dbUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = await this.userService.createUser(newUser);
    return { success: 'User created', createdUser };
  }
}
