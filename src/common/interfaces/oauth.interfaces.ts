import { Request } from 'express';

type Providers = 'google' | 'yandex';

export interface OAuthProfile {
  provider: Providers;

  providerId: string;

  email: string;
  name: string;
  picture?: string;
}

export type OAuthRequest = Request & {
  user: OAuthProfile;
};
