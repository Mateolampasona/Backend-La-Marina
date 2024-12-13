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

  generatePassword(): string {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allChars = lowerCase + upperCase + numbers + specialChars;

    let password = '';
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)];
    password += upperCase[Math.floor(Math.random() * upperCase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }
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

    const createdUser = await this.userService.createUser(createUserDto);
    console.log('Usuario creado', createdUser);

    try {
      await sendWelcomeEmail(createUserDto.email, createUserDto.name);
    } catch (error) {
      console.log(error);
    }
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
    const newPassword = this.generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(user.userId, hashedPassword);
    try {
      const name = user.name;
      await sendPasswordResetEmail(email, name, newPassword);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to send email');
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

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.getUserByEmail(googleUser.email);
    if (user) {
      return user;
    }
    googleUser.authProvider = 'google';
    return await this.userService.createUser(googleUser);
  }

  async signInOauth(user: User) {
    const payload = {
      username: user.email,
      sub: user.userId,
      role: user.role,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
