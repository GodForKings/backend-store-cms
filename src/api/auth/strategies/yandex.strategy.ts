import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-yandex';
import { OAuthProfile } from 'src/common';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow('YANDEX_CLIENT_ID'),
      clientSecret: configService.getOrThrow('YANDEX_CLIENT_SECRET'),
      callbackURL: `${configService.getOrThrow('SERVER_URL')}/auth/yandex/callback`,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (_: null, user: unknown) => unknown,
  ): void {
    const { username, emails, photos, id } = profile;

    const user: OAuthProfile = {
      provider: 'yandex',
      providerId: id,

      email: String(emails?.[0]?.value),
      name: String(username),
      picture: photos?.[0]?.value,
    };

    done(null, user);
  }
}
