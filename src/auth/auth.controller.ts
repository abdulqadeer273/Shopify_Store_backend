import { Body, Controller, Get, HttpCode, HttpStatus, NotImplementedException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: { username: string, password: string }) {
        return this.authService.authenticate(input);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Get('me')
    @Roles('admin')
    getUserInfo(@Request() request) {
        return request.user;
        
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Get('my-info')
    @Roles('user')
    getRegularUserInfo(@Request() request) {
        return request.user;
        
    }
}
