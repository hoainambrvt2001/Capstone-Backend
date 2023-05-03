import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccessEvent,
  AccessEventSchema,
} from '../../schemas/access-event.schema';
import { AccessEventController } from './access-event.controller';
import { AccessEventService } from './access-event.service';
import { StorageModule } from 'src/services/storage/storage.module';
import { MqttModule } from 'src/services/mqtt/mqtt.module';
import { ConfigModule } from '@nestjs/config';
import { Room, RoomSchema } from 'src/schemas/room.schema';
import { AbnormalEventService } from '../abnormal-event/abnormal-event.service';
import { AbnormalEventModule } from '../abnormal-event/abnormal-event.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessEvent.name, schema: AccessEventSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
    StorageModule,
    MqttModule,
    ConfigModule,
    AbnormalEventModule,
  ],
  controllers: [AccessEventController],
  providers: [AccessEventService],
})
export class AccessEventModule {}
