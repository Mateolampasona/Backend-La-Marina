import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { User } from 'src/Users/entity/user.entity';
import { Category } from 'src/Categories/entity/categories.entity';
import { Product } from 'src/Products/entity/productos.entity';
import { Order } from 'src/Orders/entity/order.entity';
import { OrderDetail } from 'src/OrderDetail/entity/orderDetail.entity';
import { subscribe } from 'node:diagnostics_channel';

dotenvConfig({ path: '.env.development' });

const config = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  autoLoadEntities: true,
  logging: false,
  dropSchema: false,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.js,.ts}'],
  subscribers: [],
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
