/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor() {} // @InjectRepository(User) private readonly usersRepository: Repository<User>

  // Servicios

  // Retornar todos los usuarios
  getUsers() {
    return 'Esta ruta retorna todos los usuarios';
  }
  
}
