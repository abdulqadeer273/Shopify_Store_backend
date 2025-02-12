import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

type AuthInput = { username: string, password: string };
type SignInData = { userId: number, username: string, roles: string[] };
type AuthResult = { accessToken: string, userId: number, username: string, roles: string[] };

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.signIn(user);
    }

    async validateUser(input: AuthInput): Promise<SignInData | null> {
        const user = await this.userService.findUserByName(input.username);
        if (user && user.password === input.password) {
            return { userId: user.userId, username: user.username, roles: user.roles };
        }
        return null;
    }

    async signIn(user: SignInData): Promise<AuthResult> {
        const payload = { userId: user.userId, username: user.username, roles: user.roles };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            userId: user.userId,
            username: user.username,
            roles: user.roles,
        };
    }
}
