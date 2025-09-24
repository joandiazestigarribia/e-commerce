import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
    ) { }

    async findAll(): Promise<Product[]> {
        return this.productsRepository.find();
    }

    async findOne(id: number): Promise<Product | null> {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async create(productData: Partial<Product>): Promise<Product> {
        const product = this.productsRepository.create(productData);
        return this.productsRepository.save(product);
    }

    async update(id: number, productData: Partial<Product>): Promise<Product> {
        await this.productsRepository.update(id, productData);
        const product = await this.findOne(id);
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async remove(id: number): Promise<void> {
        await this.productsRepository.delete(id);
    }
}