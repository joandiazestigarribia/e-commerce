import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
import { SeedsModule } from './database/seeds/seeds.module';
import { databaseConfig } from './config/database.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    ProductsModule,
    SeedsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }