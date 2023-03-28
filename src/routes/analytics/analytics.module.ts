import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from 'src/schemas/abnormal-event.schema';
import {
  AccessEvent,
  AccessEventSchema,
} from 'src/schemas/access-event.schema';
import {
  RoomStatus,
  RoomStatusSchema,
} from 'src/schemas/room-status.schema';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RoomStatus.name, schema: RoomStatusSchema },
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
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
