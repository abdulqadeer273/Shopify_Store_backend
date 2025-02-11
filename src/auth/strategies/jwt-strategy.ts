import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_SECRET } from "src/configs/jwt-secret";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() { 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET
        });
    }

    async validate(payload: { userId: number; username: string; roles: string[] }) {
        return { userId: payload.userId, username: payload.username, roles: payload.roles };
    }
}
