import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import config from './utils/config';

function initValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

function initSwagger(app: INestApplication) {  
  if (config().swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config().name)
      .setDescription(config().description)
      .setVersion(config().version)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initValidationPipe(app);
  initSwagger(app);
  await app.listen(config().port);
}
bootstrap();
