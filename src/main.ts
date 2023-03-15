import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
  .setTitle('Authentication Service')
  .setDescription('Authentication Service is a Nest.js based rest api designed to provide authentication operations by Brew Interactive.')
  .setVersion('1.0')
  .addTag('authentication', 'User authentication operations')
  .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
