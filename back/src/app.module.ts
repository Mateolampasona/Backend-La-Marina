/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductsModule } from './Products/productos.module';
import { UsersModule } from './Users/users.module';
import { AuthModule } from './Auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './Config/data-source';
import { CategoriesModule } from './Categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
