import { ArgumentsHost, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { HttpExceptionFilter } from './exception.filter';

describe('ExceptionFilter', () => {
  let httpAdapterHostMock: HttpAdapterHost;

  beforeEach(() => {
    httpAdapterHostMock = {
      httpAdapter: {
        getRequestUrl: jest.fn().mockReturnValue('/test-path'),
        reply: jest.fn(),
      },
    } as unknown as HttpAdapterHost;
  });

  it('should be defined', () => {
    const filter = new HttpExceptionFilter(httpAdapterHostMock);
    expect(filter).toBeDefined();
  });

  it('should log and format the response correctly', () => {
    const filter = new HttpExceptionFilter(httpAdapterHostMock);

    const mockLoggerError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ method: 'GET' }),
        getResponse: jest.fn(),
      }),
    } as unknown as ArgumentsHost;

    const mockException = new Error('Test error');
    filter.catch(mockException, mockArgumentsHost);

    expect(mockLoggerError).toHaveBeenCalledWith(
      'GET - StatusCode: 500 - Message: Internal server error',
      mockException.stack,
    );
  });
});
