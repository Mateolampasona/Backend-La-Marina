/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor() {}
  @InjectRepository(User) private readonly usersRepository: Repository<User>;

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (!users) {
      throw new BadRequestException('No users found');
    }
    return users;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const password = createUserDto.password;
    const confirmPassword = createUserDto.confirmPassword;
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersRepository.create(createUserDto);
    if (!user) {
      throw new BadRequestException('User not created');
    }
    return await this.usersRepository.save(createUserDto);
  }

  async deleteUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    await this.usersRepository.delete(id);
    return { message: `User with id ${id} deleted` };
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    return user;
  }
}
