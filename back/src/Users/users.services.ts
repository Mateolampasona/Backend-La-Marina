/* eslint-disable prettier/prettier */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { ModifyUserDto } from './dto/modifyUser.dto';
import * as bcrypt from 'bcrypt';
import { BanUserDto } from './dto/banUser.dto';
import {
  sendBanNotificationEmail,
  sendUnbanNotificationEmail,
} from 'src/Config/nodeMailer';
import { UserResponseDto } from './dto/responseUser';
import { ProductService } from 'src/Products/productos.service';
@Injectable()
export class UsersService {
  
  
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly productService: ProductService
) {}
  

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (!users) {
      throw new BadRequestException('No users found');
    }
    return users;
  }

  async getOneUser(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
      relations: ['order', 'order.orderDetails', 'order.orderDetails.product', 'compras', 'compras.purchaseDetails', 'compras.purchaseDetails.product', 'favorites'],
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    const {password, authProvider, ...userResponse} = user;
    return userResponse;
  }

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

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
      let hashedPassword = '';
      if (createUserDto.authProvider !== 'google') {
        hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      }
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
    try {
      await this.usersRepository.delete(id);
      return { message: `User with id ${id} deleted` };
    } catch (error) {
      throw new BadRequestException('error deleting user', error.message);
    }
  }

  async updateUser(
    userId: number,
    modifyUserDto: ModifyUserDto,
  ): Promise<{ message: string; updatedUser: User }> {
    const user = await this.usersRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }
    try {
      await this.usersRepository.update(userId, modifyUserDto);
      const updatedUser = await this.usersRepository.findOne({
        where: { userId: userId },
      });
      return { message: 'User updated successfully', updatedUser };
    } catch (error) {
      throw new BadRequestException('error updating user', error.message);
    }
  }

  async updatePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<{ message: string; updatedUser: User }> {
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

  async banUser(
    id: number,
    data: BanUserDto,
  ): Promise<{ message: string; bannedUser: User }> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    if (user.isBanned === true) {
      throw new BadRequestException(`User with id ${id} is already banned`);
    }
    try {
      await this.usersRepository.update(id, { isBanned: true });
      const bannedUser = await this.usersRepository.findOne({
        where: { userId: id },
      });
      await sendBanNotificationEmail(
        bannedUser.email,
        bannedUser.name,
        data.banreason,
      );

      return {
        message: `User banned sucessfuly, motive: ${data.banreason}`,
        bannedUser,
      };
    } catch (error) {
      throw new BadRequestException('error banning user', error.message);
    }
  }

  async unbanUser(
    id: number,
  ): Promise<{ message: string; unbannedUser: User }> {
    const user = await this.usersRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    if (user.isBanned === false) {
      throw new BadRequestException(`User with id ${id} is not banned`);
    }
    try {
      await this.usersRepository.update(id, { isBanned: false });
      const unbannedUser = await this.usersRepository.findOne({
        where: { userId: id },
      });
      await sendUnbanNotificationEmail(unbannedUser.email, unbannedUser.name);
      return {
        message: `User with id ${id} unbanned successfully`,
        unbannedUser,
      };
    } catch (error) {
      throw new BadRequestException('error unbanning user', error.message);
    }
  }

  async getTotalUsers():Promise<number> {
    const totalusers = await this.usersRepository.count();
    if(!totalusers) {
      throw new BadRequestException('No users found');
    }
    return totalusers;
}

async getLastUser(): Promise<UserResponseDto> {
  const [lastUser] = await this.usersRepository.find({
    order: { createdAt: 'DESC' },
    take: 1,
  });
  if (!lastUser) {
    throw new BadRequestException('No users found');
  }
  const { password: _, ...result } = lastUser;
      return result;
}

async addFavoriteProduct(userId: any, productId: number) {
  const user = await this.usersRepository.findOne({where:{userId}})
  if(!user) {
    throw new BadRequestException('User not found');
  }
  const product = await this.productService.getProductById(productId);
  if(!product) {
    throw new BadRequestException('Product not found');
  }
  if(!user.favorites){
    user.favorites = [];
  }
  user.favorites.push(product);

  await this.usersRepository.save(user);

  return {message: 'Product added to favorites', user};


}
}