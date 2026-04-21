import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUserDto } from 'src/modules/auth/application/dtos/authenticated-user.dto';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext): AuthenticatedUserDto => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
