import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { ApiKeyGuard } from "./utils/guards/api-key/api-key.guard";
import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import config from "./config/configuration";

function initValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

function initSwagger(app: INestApplication) {
  if (config().swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config().name)
      .setDescription(config().description)
      .setVersion(config().version)
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
  app.useGlobalGuards(new ApiKeyGuard());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: config().corsAllowedOrigins,
    credentials: true,
  });

  initGlobalGuard(app);
  initValidationPipe(app);
  initSwagger(app);
  await app.listen(config().port);
}
bootstrap();
