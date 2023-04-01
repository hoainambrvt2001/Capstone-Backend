import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RoomStatus,
  RoomStatusSchema,
} from '../../schemas/room-status.schema';
import { FirebaseService } from '../../utils/firebase-service';
import {
  AccessEvent,
  AccessEventSchema,
} from '../../schemas/access-event.schema';
import { AccessEventController } from './access-event.controller';
import { AccessEventService } from './access-event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessEvent.name, schema: AccessEventSchema },
      { name: RoomStatus.name, schema: RoomStatusSchema },
    ]),
  ],
  controllers: [AccessEventController],
  providers: [AccessEventService, FirebaseService],
})
export class AccessEventModule {}
