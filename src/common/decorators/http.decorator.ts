import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IS_DEV_ENV } from '../utils';

export const UserAgent = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request.headers['user-agent'];
});

export const ClientIp = createParamDecorator((_: string, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest<Request>();

  if (IS_DEV_ENV) return '192.168.0.1';

  if (Array.isArray(request.headers['cf-connecting-ip']))
    return request.headers['cf-connecting-ip'][0];

  if (typeof request.headers['x-forwarded-for'] === 'string') {
    return request.headers['x-forwarded-for'].split(',')[0];
  } else return String(request.ip);
});
