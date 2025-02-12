import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from 'src/users/create-user.dto';
import { UsersService } from 'src/users/users.service';
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly usersService: UsersService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() input: { usernameOrEmail: string, password: string }) {
        return this.authService.authenticate(input);
    }

    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            // Check if the username already exists
            const existingUserByUsername = await this.usersService.findUserByName(createUserDto.username);
            if (existingUserByUsername) {
                throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);
            }

            // Check if the email already exists
            const existingUserByEmail = await this.usersService.findByEmail(createUserDto.email);
            if (existingUserByEmail) {
                throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
            }

            // Create the user
            const user = await this.usersService.create(createUserDto);
            return { message: 'User registered successfully', user };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
