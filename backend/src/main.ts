import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseSeedService } from './database/seeds/database-seed.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const seedService = app.get(DatabaseSeedService);
  await seedService.seedAll();

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Backend running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();