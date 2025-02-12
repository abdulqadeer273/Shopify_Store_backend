import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // Retrieve the required roles from the handler or class using the Reflector
        const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
        if (!requiredRoles) {
            return true; // If no roles are required, allow access
        }

        // Get the request object from the context
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if the user or user roles exist
        if (!user || !user.roles) {
            throw new ForbiddenException('Access denied. No roles found for the user.');
        }

        // Check if the user has at least one of the required roles
        const hasRole = user.roles.some((role: string) => requiredRoles.includes(role));
        if (!hasRole) {
            throw new ForbiddenException('Access denied. Insufficient permissions.');
        }

        return true; // Allow access if the user has the required role(s)
    }
}