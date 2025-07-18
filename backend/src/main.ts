import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow CORS for frontend (localhost:3001)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();