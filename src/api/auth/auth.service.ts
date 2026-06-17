import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { AuthDto } from '../user/dto/auth.dto';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';
import { isDev, JwtPayload, OAuthProfile } from 'src/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN: number = 1;
  REFRESH_TOKEN_NAME: string = 'refreshToken';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  issueTokens(userId: string) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, { expiresIn: '1h' });

    const refreshToken = this.jwtService.sign(data, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async validateOAuthLogin(dto: OAuthProfile) {
    let user = await this.userService.getByEmail(dto.email);

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          picture: dto.picture,
        },
        include: { stores: true, favorites: true, orders: true },
      });
    }

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expireIn = new Date();

    expireIn.setDate(expireIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: this.configService.get<string>('DOMAIN'),
      expires: expireIn,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: this.configService.get<string>('DOMAIN'),
      expires: new Date(0),
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
    });
  }

  async getNewTokens(refreshToken: string) {
    const result: JwtPayload = await this.jwtService.verifyAsync(refreshToken);

    if (!result) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }

    const user = await this.userService.getById(result.id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async login(dto: LoginRequest) {
    const user = await this.validateUser(dto);

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }

  async register(dto: RegisterRequest) {
    const oldUser = await this.userService.getByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException('Пользователь с таким email уже зарегистрирован');
    }

    const user = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id);

    return { user, ...tokens };
  }
}
