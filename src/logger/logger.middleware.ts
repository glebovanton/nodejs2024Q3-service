import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { query, method, body, originalUrl } = req;

    res.on('finish', () => {
      const message = `${method} ROUTE:${originalUrl} - Status Code:${
        res.statusCode
      } - Query:${JSON.stringify(query)} - Body:${JSON.stringify(body)}}`;

      if (
        res.statusCode < HttpStatus.INTERNAL_SERVER_ERROR &&
        res.statusCode >= HttpStatus.BAD_REQUEST
      ) {
        this.logger.warn(message, LoggerMiddleware.name);
      } else if (res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(message, LoggerMiddleware.name);
      } else {
        this.logger.log(message, LoggerMiddleware.name);
      }
    });

    next();
  }
}
