import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalType,
  AbnormalTypeSchema,
} from '../../schemas/abnormal-type.schema';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import { AbnormalEventController } from './abnormal-event.controller';
import { AbnormalEventService } from './abnormal-event.service';
import { StorageModule } from 'src/services/storage/storage.module';
import { MqttModule } from 'src/services/mqtt/mqtt.module';
import { ConfigModule } from '@nestjs/config';
import { Room, RoomSchema } from 'src/schemas/room.schema';

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
      { name: Room.name, schema: RoomSchema },
    ]),
    StorageModule,
    MqttModule,
    ConfigModule,
  ],
  controllers: [AbnormalEventController],
  providers: [AbnormalEventService],
  exports: [AbnormalEventService],
})
export class AbnormalEventModule {}
