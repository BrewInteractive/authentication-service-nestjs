import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import config from './utils/config';

function initSwagger(app: INestApplication) {
  if (config().environment === 'dev') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Authentication Service')
      .setDescription('Authentication Service is a Nest.js based rest api designed to provide authentication operations by Brew Interactive.')
      .setVersion(config().version)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, document);
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  await app.listen(config().port);
}
bootstrap();
