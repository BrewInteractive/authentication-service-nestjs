import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from "./app.module";
import { INestApplication } from '@nestjs/common';
import { NestFactory } from "@nestjs/core";
import config from './utils/config';

function initSwagger(app: INestApplication) {
  if (config().environment === 'dev') {
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
  initSwagger(app);
  await app.listen(config().port);
}
bootstrap();
