import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type AuthInput = { username: string, password: string };
type SignInData = { userId: number, username: string, roles: string[] };
type AuthResult = { accessToken: string, userId: number, username: string, roles: string[] };

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async authenticate(input: AuthInput): Promise<AuthResult> {
        const user = await this.validateUser(input.username, input.password);
        console.log(user, 'user3');
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.signIn(user);
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByName(username);
        if(user){
            console.log(await bcrypt.compare(pass, user.password), 'await bcrypt.compare(pass, user.password)');
        }
        if (user && await bcrypt.compare(pass, user.password)) {
          const { password, ...result } = user.toObject(); // Remove password from the result
          return result;
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
            roles: user.roles
        };
    }

    // Allow guest users to place orders
    async guestCheckout(): Promise<{ message: string }> {
        return { message: "Guest order placed successfully." };
    }
}
