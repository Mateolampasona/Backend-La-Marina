/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { ModifyUserDto } from './dto/modifyUser.dto';
import * as bcrypt from 'bcrypt';

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

  async createUser(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = {
        ...createUserDto,
        password: hashedPassword,
      };
      const createdUser = await this.usersRepository.create(newUser);
      const savedUser = await this.usersRepository.save(newUser);
      const { password: _, ...result } = savedUser;
      return result;
    } catch (error) {
      throw new BadRequestException('error creating user', error.message);
    }
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

    return user;
  }

  async updateUser(
    id: number,
    modifyUserDto: ModifyUserDto,
  ): Promise<{ message: string; updatedUser: User }> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    try {
      await this.usersRepository.update(id, modifyUserDto);
      const updatedUser = await this.usersRepository.findOne({
        where: { userId: id },
      });
      return { message: 'User updated successfully', updatedUser };
    } catch (error) {
      throw new BadRequestException('error updating user', error.message);
    }
  }

  async updatePassword(userId: number, hashedPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }
    try {
      await this.usersRepository.update(userId, { password: hashedPassword });
      const updatedUser = await this.usersRepository.findOne({
        where: { userId: userId },
      });
      return { message: 'Password updated successfully', updatedUser };
    } catch (error) {
      throw new BadRequestException('error updating password', error.message);
    }
  }
}
