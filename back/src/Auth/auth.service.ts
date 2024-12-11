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
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from 'src/Config/nodeMailer';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AssignPasswordDto } from './dto/assignPassword.dto';

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
    try {
      await sendWelcomeEmail(createUserDto.email, createUserDto.name);
    } catch (error) {
      console.log(error);
    }
    const createdUser = await this.userService.createUser(createUserDto);
    return { success: 'User created', createdUser };
  }

  async changePassword(passwords: ChangePasswordDto, id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (passwords.newPassword === passwords.oldPassword) {
      throw new BadRequestException(
        'New password must be different from the old one',
      );
    }
    const isPasswordValid = await bcrypt.compare(
      passwords.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const hashedPassword = await bcrypt.hash(passwords.newPassword, 10);
    return await this.userService.updatePassword(user.userId, hashedPassword);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.userId, hashedPassword);
    try {
      const name = user.name;
      await sendPasswordResetEmail(email, name, newPassword);
    } catch (error) {
      console.log(error);
    }
    return { success: 'New password sent to your email' };
  }

  async assignPassword(password: AssignPasswordDto, id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    if (password.password !== password.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashedPassword = await bcrypt.hash(password.password, 10);
    return await this.userService.updatePassword(user.userId, hashedPassword);
  }
}
