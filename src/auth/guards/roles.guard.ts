import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true; // If no roles are set, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.roles) {
            throw new ForbiddenException('Access denied. No roles found.');
        }

        const hasRole = user.roles.some(role => requiredRoles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('Access denied. Insufficient permissions.');
        }

        return true;
    }
}
