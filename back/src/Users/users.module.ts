/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.services';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/Products/productos.module';
import { ChatGateway } from 'src/gateway/chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProductsModule],
  controllers: [UsersController],
  providers: [UsersService, ChatGateway],
  exports: [UsersService, ChatGateway],
})
export class UsersModule {}
