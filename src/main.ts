import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication, ValidationPipe } from '@nestjs/common';

function initValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initValidationPipe(app);
  await app.listen(3000);
}
bootstrap();
