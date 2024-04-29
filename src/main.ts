import * as fs from "fs";
import * as path from "path";

import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { INestApplication, ValidationPipe } from "@nestjs/common";

import { ApiKeyGuard } from "./utils/guards/api-key/api-key.guard";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import config from "./config/configuration";

import mjml2html = require("mjml");

function initValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe());
}

function initSwagger(app: INestApplication) {
  if (config().swaggerEnabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(config().name)
      .setDescription(config().description)
      .setVersion(config().version)
      .addServer(config().basePath)
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

function buildMjmlTemplates(
  sourceDir: string = __dirname + "/template/templates",
  distDir: string = __dirname + "/template/dist-templates"
) {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.readdirSync(sourceDir).forEach((fileOrDirectoryName) => {
    const sourceItemPath = path.join(sourceDir, fileOrDirectoryName);
    const distItemPath = path.join(distDir, fileOrDirectoryName);

    if (fs.statSync(sourceItemPath).isDirectory()) {
      buildMjmlTemplates(sourceItemPath, distItemPath);
    } else if (fileOrDirectoryName.endsWith(".mjml")) {
      const mjmlTemplateContent = fs.readFileSync(sourceItemPath, "utf8");
      const { html: htmlTemplateContent } = mjml2html(mjmlTemplateContent);
      fs.writeFileSync(
        path.join(distDir, fileOrDirectoryName.replace(".mjml", ".html")),
        htmlTemplateContent
      );
      console.log(`Converted ${fileOrDirectoryName} to HTML`);
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  buildMjmlTemplates();

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
