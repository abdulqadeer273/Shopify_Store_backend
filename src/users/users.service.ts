import { Injectable } from '@nestjs/common';

export type User = {
    userId: number;
    username: string;
    password: string;
    roles: string[]; // Add roles as an array of strings
};

const users: User[] = [
    {
        userId: 1,
        username: 'admin',
        password: 'admin',
        roles: ['admin'], // Add admin role
    },
    {
        userId: 2,
        username: 'user',
        password: 'rana1234',
        roles: ['user'], // Add user role
    },
];

@Injectable()
export class UsersService {
    async findUserByName(username: string): Promise<User | undefined> {
        return users.find((user) => user.username === username);
    }
}