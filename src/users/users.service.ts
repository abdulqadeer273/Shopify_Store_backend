import { Injectable } from '@nestjs/common';

export type User = {
    userId: number;
    username: string;
    password: string;
}

const users: User[] = [
    {
        userId: 1,
        username: 'admin',
        password: 'admin'
    },
    {
        userId: 2,
        username: 'user',
        password: 'rana1234'
    }
];

@Injectable()
export class UsersService { 
    async findUserByName(username: string): Promise<User | undefined> {
        return users.find(user => user.username === username);
    }
}
