import { readFileSync } from 'node:fs';
import * as dotenv from 'dotenv';
import * as yaml from 'js-yaml';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { LoggerService } from '@/logger/logger.service';
import { HttpExceptionFilter } from '@/filter/exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 4000;
  const swaggerPath = 'doc';
  const logger: LoggerService = app.get(LoggerService);
  const httpAdapterHost = app.get(HttpAdapterHost);

  const swaggerDoc = yaml.load(
    readFileSync('doc/api.yaml', { encoding: 'utf-8' }),
  ) as OpenAPIObject;

  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  SwaggerModule.setup(swaggerPath, app, swaggerDoc);

  process.on('unhandledRejection', (reason) => {
    logger.error(
      'Unhandled Rejection!',
      reason instanceof Error ? reason.stack : String(reason),
    );
  });
  process.on('uncaughtException', (e: Error) => {
    logger.error('Uncaught Exception!', e.stack);
    process.exit(1);
  });

  await app.listen(port);
  console.log(
    `Swagger ${process.pid} works on the http://${host}:${port}/${swaggerPath}/`,
  );
}

bootstrap();
