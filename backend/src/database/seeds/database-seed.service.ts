import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { productsSeedData } from './products.seed';

@Injectable()
export class DatabaseSeedService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

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
    }
}