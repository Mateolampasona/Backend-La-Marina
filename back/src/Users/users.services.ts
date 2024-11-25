/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor() {}
  @InjectRepository(User) private readonly usersRepository: Repository<User>;

  getUsers() {
    return 'Esta ruta retorna todos los usuarios';
  }
}
