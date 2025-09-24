import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { DatabaseSeedService } from './database-seed.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [DatabaseSeedService],
    exports: [DatabaseSeedService],
})
export class SeedsModule { }