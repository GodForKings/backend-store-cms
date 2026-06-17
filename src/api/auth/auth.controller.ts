import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { OAuthRequest } from 'src/common/interfaces/oauth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginRequest, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken, user } = await this.authService.login(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return { user, accessToken };
  }

  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterRequest, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, accessToken, user } = await this.authService.register(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return { user, accessToken };
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies[this.authService.REFRESH_TOKEN_NAME] as string;

    if (typeof refreshToken !== 'string') {
      this.authService.removeRefreshTokenToResponse(res);
      throw new UnauthorizedException('Refresh token отсутствует');
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.getNewTokens(refreshToken);

    this.authService.addRefreshTokenToResponse(res, newRefreshToken);

    return { user, accessToken };
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshTokenToResponse(res);
    return true;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: OAuthRequest, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.validateOAuthLogin(req.user);

    this.authService.addRefreshTokenToResponse(res, data.refreshToken);

    return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${data.accessToken}`);
  }

  @Get('yandex')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuth() {}

  @Get('yandex/callback')
  @UseGuards(AuthGuard('yandex'))
  async yandexAuthCallback(@Req() req: OAuthRequest, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.validateOAuthLogin(req.user);

    this.authService.addRefreshTokenToResponse(res, data.refreshToken);

    return res.redirect(`${process.env['CLIENT_URL']}/dashboard?accessToken=${data.accessToken}`);
  }
}
