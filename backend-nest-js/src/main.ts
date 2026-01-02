import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //anlamı: DTO'da tanımlanmayan alanları siler
      forbidNonWhitelisted: true, //anlamı: istenmeyen alanlar varsa hata fırlatır
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('SineDeck API')
    .setDescription('SineDeck Dizi ve Film Platformu API Dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth() // Bearer token authentication ekler
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI'yi /api-docs yolunda sunar

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
