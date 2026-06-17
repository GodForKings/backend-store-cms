import { ConfigService } from '@nestjs/config';
import { configDotenv } from 'dotenv';

configDotenv();

export const isDev = (configService: ConfigService): boolean =>
  configService.getOrThrow<string>('NODE_ENV') === 'development';

export const IS_DEV_ENV = process.env['NODE_ENV'] === 'development';
