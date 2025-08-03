import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { addUser } from '../helpers/add-user-to-header';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Checks if the route is public, if it is, allows the request to pass.
   * If not, it verifies the authentication token and adds the user to the request.
   * If the token is invalid or expired, throws an UnauthorizedException.
   * @param context The execution context of the request.
   * @returns A boolean indicating if the request is allowed or not.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const authentication = this.getAuthentication(context);

    try {
      const decoded = this.jwtService.verify(authentication);
      addUser(decoded, context);
      return true;
    } catch (err) {
      const verifiedUser = await this.authService.verifyUser(authentication);
      if (!verifiedUser) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      addUser(verifiedUser, context);
      return true;
    }
  }

  private getAuthentication(context: ExecutionContext): string {
    const type = context.getType();
    let authentication: string | undefined;

    if (type === 'rpc') {
      authentication = context.switchToRpc().getData()?.Authentication;
    } else if (type === 'http') {
      authentication = context.switchToHttp().getRequest().cookies?.Authentication;
    } else {
      throw new UnauthorizedException('Unsupported context type');
    }

    if (!authentication) {
      throw new UnauthorizedException('No value was provided for Authentication');
    }

    return authentication;
  }
}
