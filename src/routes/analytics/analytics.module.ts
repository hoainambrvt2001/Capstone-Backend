import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import {
  AccessEvent,
  AccessEventSchema,
} from '../../schemas/access-event.schema';
import { Room, RoomSchema } from 'src/schemas/room.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { RoomService } from '../room/room.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      {
        name: AbnormalEvent.name,
        schema: AbnormalEventSchema,
      },
      {
        name: AccessEvent.name,
        schema: AccessEventSchema,
      },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, RoomService],
})
export class AnalyticsModule {}
