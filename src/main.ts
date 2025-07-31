import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  // Retrieve app configuration values
  const { name, desc, version, port } = getAppConfig(configService);

  // Set up Swagger
  setupSwagger(app, { name, desc, version });

  app.enableCors();

  await app.listen(port ?? 3000);
}

/**
 * Retrieve application configuration from ConfigService
 * @param configService The ConfigService instance
 * @returns An object containing app configuration values
 */
function getAppConfig(configService: ConfigService) {
  return {
    name: configService.get('name'),
    desc: configService.get('desc'),
    version: configService.get('version'),
    port: configService.get('PORT'),
  };
}

/**
 * Set up Swagger API documentation
 * @param app The NestJS application instance
 * @param config An object containing the app's name, description, and version
 */
function setupSwagger(
  app,
  config: { name: string; desc: string; version: string },
) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(config.name)
    .setDescription(config.desc)
    .setVersion(config.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
