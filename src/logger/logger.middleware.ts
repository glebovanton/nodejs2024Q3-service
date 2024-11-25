import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(LoggerMiddleware.name);

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
        this.logger.warn(message);
      } else if (res.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
