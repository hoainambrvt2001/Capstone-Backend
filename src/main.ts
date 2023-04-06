import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import {
//   MicroserviceOptions,
//   Transport,
// } from '@nestjs/microservices';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );
  // const mqttMicroservice =
  //   app.connectMicroservice<MicroserviceOptions>({
  //     transport: Transport.MQTT,
  //     options: {
  //       host: 'mqtt://io.adafruit.com:443',
  //       username: 'izayazuna',
  //       password: 'aio_DuNY42jwa9M0ESFcvxVb6z8873cL',
  //     },
  //   });
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
  // await app.startAllMicroservices();
  await app.listen(3333);
}
bootstrap();
