import { IsString, IsNotEmpty, IsArray, IsOptional, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(20, { message: 'Username cannot be longer than 20 characters' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' }) // Ensure valid email format
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    @MaxLength(50, { message: 'First name cannot be longer than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    @MaxLength(50, { message: 'Last name cannot be longer than 50 characters' })
    lastName: string;

    @IsArray()
    @IsOptional() // Roles are optional
    @IsString({ each: true, message: 'Each role must be a string' })
    roles?: string[];
}