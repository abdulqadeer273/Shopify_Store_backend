import { Injectable } from '@nestjs/common';

export type User = {
    userId: number;
    username: string;
    password: string;
    roles: string[]; // Added roles to enforce strict access
};

const users: User[] = [
    {
        userId: 1,
        username: 'admin',
        password: 'admin',
        roles: ['admin'] // Admin role
    },
    {
        userId: 2,
        username: 'user',
        password: 'rana1234',
        roles: ['user'] // Regular user role
    }
];

@Injectable()
export class UsersService { 
    async findUserByName(username: string): Promise<User | undefined> {
        return users.find(user => user.username === username);
    }
}
