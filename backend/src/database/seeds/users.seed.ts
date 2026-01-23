import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersSeed {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async seed() {
        const existingUsers = await this.usersRepository.count();
        if (existingUsers > 0) {
            console.log('👥 Users already seeded');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        const users = [
            {
                email: 'admin@ecommerce.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
            },
            {
                email: 'user@ecommerce.com',
                password: hashedPassword,
                firstName: 'Test',
                lastName: 'User',
                role: 'USER',
            },
        ];

        await this.usersRepository.save(users);
        console.log('✅ Users seeded successfully');
    }
}