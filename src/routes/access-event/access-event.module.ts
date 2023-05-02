import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RoomStatus,
  RoomStatusSchema,
} from '../../schemas/room-status.schema';
import {
  AccessEvent,
  AccessEventSchema,
} from '../../schemas/access-event.schema';
import { AccessEventController } from './access-event.controller';
import { AccessEventService } from './access-event.service';
import { StorageModule } from 'src/services/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessEvent.name, schema: AccessEventSchema },
      { name: RoomStatus.name, schema: RoomStatusSchema },
    ]),
    StorageModule
  ],
  controllers: [AccessEventController],
  providers: [AccessEventService],
})
export class AccessEventModule {}
