import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../src/schemas/abnormal-event.schema';
import {
  Room,
  RoomSchema,
} from '../../src/schemas/room.schema';

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
        name: Room.name,
        schema: RoomSchema,
      },
    ]),
  ],
  controllers: [AbnormalEventController],
  providers: [AbnormalEventService],
})
export class AbnormalEventModule {}
