import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );
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
  app.setViewEngine('hbs');
  await app.listen(parseInt(process.env.PORT) || 3333);
}
bootstrap();
