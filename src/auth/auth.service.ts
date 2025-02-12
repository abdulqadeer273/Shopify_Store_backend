import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type AuthInput = { usernameOrEmail: string, password: string };
type SignInData = { userId: number, username: string, roles: string[] };
type AuthResult = { accessToken: string, user: SignInData };

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input.usernameOrEmail, input.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.signIn(user);
    }

    async validateUser(usernameOrEmail: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByName(usernameOrEmail) || await this.usersService.findByEmail(usernameOrEmail);
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user; // Remove password from the result
          return result;
        }
        return null;
      }

    async signIn(user: SignInData): Promise<AuthResult> {
        const payload = { userId: user.userId, username: user.username, roles: user.roles };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user
        };
    }

    // Allow guest users to place orders
    async guestCheckout(): Promise<{ message: string }> {
        return { message: "Guest order placed successfully." };
    }
}
