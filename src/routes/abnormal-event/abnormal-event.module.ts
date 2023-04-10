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
import { FirebaseService } from '../../utils/firebase-service';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import { AbnormalEventController } from './abnormal-event.controller';
import { AbnormalEventService } from './abnormal-event.service';
import { MqttService } from '../mqtt/mqtt.service';

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
  ],
  controllers: [AbnormalEventController],
  providers: [
    AbnormalEventService,
    FirebaseService,
    MqttService,
  ],
})
export class AbnormalEventModule {}
