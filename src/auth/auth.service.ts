import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { decode } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignUpDto } from './dto';
import { JwtPayload } from './types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  public async signUp(dto: SignUpDto) {
    return await this.userService.create(dto);
  }

  public async login({ login, password }: LoginDto) {
    const user = await this.userService.findOneByLogin(login);

    if (user) {
      const isCorrectPassword = bcrypt.compare(password, user.password);

      if (!isCorrectPassword) {
        throw new NotFoundException('Invalid credentials');
      }

      const { id, login } = user;

      const payload: JwtPayload = { userId: id, login };

      const tokens = this.getTokens(payload);

      return { ...payload, ...tokens };
    }

    throw new NotFoundException('User not found');
  }

  public async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token.trim(), {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const { exp, iat, ...cleanPayload } = payload;
      const tokens = this.getTokens(cleanPayload);

      return { ...cleanPayload, ...tokens };
    } catch (error) {
      console.error('!JWT Verification Error:', error.message);
      throw new ForbiddenException('Refresh token is not valid');
    }
  }

  private getTokens(payload: JwtPayload) {
    const { exp, iat, ...cleanPayload } = payload;

    const accessToken = this.jwtService.sign(cleanPayload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h',
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = this.jwtService.sign(cleanPayload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h',
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });

    return { accessToken, refreshToken };
  }
}
