import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { OrderDetail } from '../OrderDetail/entity/orderDetail.entity'; // Importa la entidad OrderDetail
import { Order } from '../Orders/entity/order.entity'; // Importa la entidad Order
import { User } from '../Users/entity/user.entity'; // Importa la entidad User
import { Product } from '../Products/entity/productos.entity'; // Importa la entidad Product
import { Category } from '../Categories/entity/categories.entity'; // Importa la entidad Category

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
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    OrderDetail,
    Order,
    User,
    Product,
    Category,
    __dirname + '/../**/*.entity{.ts,.js}'
  ],
  migrations: ['dist/migrations/*{.js,.ts}'],
  subscribers: [],
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);