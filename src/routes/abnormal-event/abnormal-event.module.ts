import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalType,
  AbnormalTypeSchema,
} from '../../schemas/abnormal-type.schema';
import {
  RoomStatus,
  RoomStatusSchema,
} from '../../schemas/room-status.schema';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import { AbnormalEventController } from './abnormal-event.controller';
import { AbnormalEventService } from './abnormal-event.service';
import { StorageModule } from 'src/services/storage/storage.module';
import { MqttModule } from 'src/services/mqtt/mqtt.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AbnormalEvent.name,
        schema: AbnormalEventSchema,
      },
      {
        name: AbnormalType.name,
        schema: AbnormalTypeSchema,
      },
      { name: RoomStatus.name, schema: RoomStatusSchema },
    ]),
    StorageModule,
    MqttModule,
    ConfigModule,
  ],
  controllers: [AbnormalEventController],
  providers: [AbnormalEventService],
})
export class AbnormalEventModule {}
