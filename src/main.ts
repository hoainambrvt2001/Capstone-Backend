import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    preflightContinue: false,
    credentials: true,
    optionsSuccessStatus: 204,
  });
  // ** NestJS Pipe: https://docs.nestjs.com/pipes to validate data in the dto object.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ** Delete all fields that don't define in the dto object.
    }),
  );
  await app.listen(3333);
}
bootstrap();
