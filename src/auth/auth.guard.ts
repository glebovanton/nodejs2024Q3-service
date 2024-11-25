import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { method, url, headers } = context.switchToHttp().getRequest();

    if (isPublic) {
      return true;
    }

    if (method === 'POST' && url === '/auth/refresh') {
      return true;
    }

    const token = this.extractTokenFromHeader(headers);

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const { login, userId } = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });

      const user: User = await this.userService.findOne(userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (login !== user.login) {
        throw new UnauthorizedException(
          'Token login does not match user login',
        );
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }

      console.error('Unexpected error in AuthGuard:', error);
      throw new UnauthorizedException('Authentication failed');
    }

    return true;
  }

  private extractTokenFromHeader(headers: Request['headers']) {
    const authHeader = headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
