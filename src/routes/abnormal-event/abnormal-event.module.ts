import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalType,
  AbnormalTypeSchema,
} from 'src/schemas/abnormal-type.schema';
import {
  RoomStatus,
  RoomStatusSchema,
} from 'src/schemas/room-status.schema';
import { FirebaseService } from 'src/utils/firebase-service';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import { AbnormalEventController } from './abnormal-event.controller';
import { AbnormalEventService } from './abnormal-event.service';

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
  providers: [AbnormalEventService, FirebaseService],
})
export class AbnormalEventModule {}
