import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();
const { HOST = 'localhost', PORT = '4000' } = process.env;

@Injectable()
export class AppService {
  getHello(): string {
    const link = `http://${HOST}:${PORT}/doc/`;
    return `Welcome to Home Library Service! Go to <a href="${link}">${link}</a>`;
  }
}
