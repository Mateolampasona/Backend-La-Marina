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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
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
    return { success: 'Logged in' };
  }

  async signUp(createUserDto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    return await this.userService.createUser(createUserDto);
  }
}
