/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/Users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/Users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
