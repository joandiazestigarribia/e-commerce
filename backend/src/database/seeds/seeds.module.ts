import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { DatabaseSeedService } from './database-seed.service';
import { User } from 'src/users/entities/user.entity';
import { UsersSeed } from './users.seed';

@Module({
    imports: [TypeOrmModule.forFeature([Product, User])],
    providers: [DatabaseSeedService, UsersSeed],
    exports: [DatabaseSeedService],
})
export class SeedsModule { }