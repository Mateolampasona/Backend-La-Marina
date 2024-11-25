/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './Middlewares/logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API de La Marina')
    .setDescription('Documentación de la API de La Marina')
    .setVersion('1.0')
    .addTag('La Marina')
    // .addBearerAuth({
    //   type: 'http',
    //   scheme: 'bearer',
    //   bearerFormat: 'JWT',
    // })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(loggerGlobal);
  await app.listen(3000);
}
bootstrap();
