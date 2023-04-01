import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Room,
  RoomSchema,
} from '../../schemas/room.schema';
import {
  RoomType,
  RoomTypeSchema,
} from 'src/schemas/room-type.schema';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import {
  RoomStatus,
  RoomStatusSchema,
} from 'src/schemas/room-status.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Room.name,
        schema: RoomSchema,
      },
      {
        name: RoomType.name,
        schema: RoomTypeSchema,
      },
      { name: RoomStatus.name, schema: RoomStatusSchema },
    ]),
  ],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
