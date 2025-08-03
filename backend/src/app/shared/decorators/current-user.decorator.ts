import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { ContextType } from '@nestjs/common/interfaces';

export const getCurrentUserByContext = (context: ExecutionContext): UserDto | undefined => {
  const type = context.getType<ContextType>();

  if (type === 'http') {
    return context.switchToHttp().getRequest()?.user;
  }
  throw new Error(`Unsupported context type: ${type}`);
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context),
);
