import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestAccess,
  RequestAccessSchema,
} from '../../schemas/request-access.schema';
import { RequestAccessController } from './request-access.controller';
import { RequestAccessService } from './request-access.service';
import { MqttModule } from 'src/services/mqtt/mqtt.module';
import { MqttService } from 'src/services/mqtt/mqtt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RequestAccess.name,
        schema: RequestAccessSchema,
      },
    ]),
    MqttModule,
    ConfigModule
  ],
  controllers: [RequestAccessController],
  providers: [RequestAccessService, MqttService],
})
export class RequestAccessModule {}
