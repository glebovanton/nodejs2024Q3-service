import { readFileSync } from 'node:fs';
import * as yaml from 'js-yaml';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const host = configService.get<number>('HOST') || 'localhost';
  const port = configService.get<number>('PORT') || 4000;
  const swaggerPath = 'doc';

  const swaggerDoc = yaml.load(
    readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
  ) as OpenAPIObject;

  SwaggerModule.setup(swaggerPath, app, swaggerDoc);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(4000);
  console.log(
    `Swagger ${process.pid} works on the http://${host}:${port}/${swaggerPath}/`,
  );
}

bootstrap();
