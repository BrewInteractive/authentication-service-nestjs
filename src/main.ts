import {
  APPLICATION_INFO_CONFIGURATIONS,
  SERVER_CONFIGURATIONS,
} from "./config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { ApiKeyGuard } from "./utils/guards/api-key/api-key.guard";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

function initValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

function initSwagger(app: INestApplication) {
  if (SERVER_CONFIGURATIONS().swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(APPLICATION_INFO_CONFIGURATIONS().name)
      .setDescription(APPLICATION_INFO_CONFIGURATIONS().description)
      .setVersion(APPLICATION_INFO_CONFIGURATIONS().version)
      .addServer(SERVER_CONFIGURATIONS().basePath)
      .addSecurity("ApiKey", {
        type: "apiKey",
        name: "x-api-key",
        in: "header",
      })
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("docs", app, document);
  }
}

function initGlobalGuard(app: INestApplication) {
  app.useGlobalGuards(new ApiKeyGuard(app.get(ConfigService)));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: SERVER_CONFIGURATIONS().corsAllowedOrigins,
    credentials: true,
  });

  initGlobalGuard(app);
  initValidationPipe(app);
  initSwagger(app);
  await app.listen(SERVER_CONFIGURATIONS().port);
}
bootstrap();
