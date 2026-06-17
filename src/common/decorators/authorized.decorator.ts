import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Request } from 'express';

interface RequestWithUser extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator<keyof User | undefined>(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    return data ? user[data] : user;
  },
);
