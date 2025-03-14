/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Auth/auth.module';
import { CategoriesModule } from './Categories/categories.module';
import TypeOrmConfig from './config/data-source';
import { OrderDetailModule } from './OrderDetail/orderDetail.module';
import { OrderModule } from './Orders/ordenes.module';
import { ProductsModule } from './Products/productos.module';
import { UsersModule } from './Users/users.module';
import { PaymentModule } from './payment/payment.module';
import { FormModule } from './forms/form.module';
import { ComprasModule } from './Compras/compras.module';
import { ChatGateway } from './gateway/chat.gateway';
import { MontsModule } from './monts/monts.module';
import { DiscountModule } from './discounts/discount.module';
import { AddressesModule } from './addresses/addresses.module';

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
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    FormModule,
    ComprasModule,
    MontsModule,
    DiscountModule,
    AddressesModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
