import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto, RefreshTokenDto, SignUpDto } from './dto';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('signup')
  async signup(@Body() dto: SignUpDto) {
    return await this.authService.signUp(dto);
  }

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }
    return await this.authService.refreshToken(body.refreshToken);
  }
}
