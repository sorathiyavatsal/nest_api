import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
const matchRoles = (roles, userRoles) => {
  return roles.some((role) => role === userRoles);
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest() as any;
    const token = req.headers.authorization;
    const accessToken = token && token.split(' ')[1];
    let user: any = await this.authService.verifyToken(accessToken);
    return matchRoles(roles, user.role);
  }
}
