import { ExecutionContext } from '@nestjs/common';

export function addUser(user: any, context: ExecutionContext) {
  if (context.getType() === 'http') {
    context.switchToHttp().getRequest().user = user;
  } else {
    throw new Error('Unsupported context type');
  }
}
