/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { CategoriesSeed } from './seeds/categories/categories.seed';
import { ProductSeed } from './seeds/products/products.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed();
  console.log('La inserción de categorias ha terminado');
  const productSeed = app.get(ProductSeed);
  await productSeed.seed();
  console.log('La inserción de productos ha terminado');

  app.use(loggerGlobal);
  await app.listen(3000);
}
bootstrap();
