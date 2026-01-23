import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { productsSeedData } from './products.seed';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DatabaseSeedService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async seedUsers(): Promise<void> {
        const count = await this.usersRepository.count();

        if (count === 0) {
            console.log('🌱 Seeding users...');

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

            await this.usersRepository.insert(users);

            console.log(`✅ Seeded ${users.length} users`);
        } else {
            console.log(`👥 Database already has ${count} users`);
        }
    }

    async seedProducts(): Promise<void> {
        const count = await this.productsRepository.count();

        if (count === 0) {
            console.log('🌱 Seeding products...');

            await this.productsRepository.insert(productsSeedData);

            console.log(`✅ Seeded ${productsSeedData.length} products`);
        } else {
            console.log(`📦 Database already has ${count} products`);
        }
    }

    async seedAll(): Promise<void> {
        await this.seedProducts();
        await this.seedUsers();
    }
}