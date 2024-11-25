import { LoggerMiddleware } from './logger.middleware';
import { LoggerService } from '@/logger/logger.service';

describe('LoggerMiddleware', () => {
  it('should be defined', () => {
    const mockLoggerService: LoggerService = new LoggerService();
    expect(new LoggerMiddleware(mockLoggerService)).toBeDefined();
  });
});
