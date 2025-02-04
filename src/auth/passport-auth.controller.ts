import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotImplementedException,
    Post,
    Request,
    UseGuards
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { PassportLocalGuard } from "./guards/passport-local.guard";
import { PassportJwtGuard } from "./guards/passport-jwt.guard";

@Controller('auth-v2')
export class PassportAuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(PassportLocalGuard)
    login(@Request() request) {
        return this.authService.signIn(request.user);
    }
    @Get('me')
    @UseGuards(PassportJwtGuard)
    getUserInfo(@Request() request) {
        return request.user;
    }
}