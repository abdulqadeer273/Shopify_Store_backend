import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async findUserByName(username: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ username }).exec();
        return user || undefined;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, firstName, lastName, roles } = createUserDto;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const newUser = new this.userModel({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
            roles: roles || ['user'], // Default role is 'user'
        });
        await newUser.save();
        newUser.password = undefined as any; // Remove the password field
        return newUser;
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email }).exec();
        return user || undefined;
    }
}