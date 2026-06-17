import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions = (origins: string[]): CorsOptions => {
  return {
    origin: origins,
    credentials: true,
    exposedHeaders: 'set-cookie',
    allowedHeaders: ['Authorization', 'X-Api-Key'],
  };
};
