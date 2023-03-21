import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RoomType,
  RoomTypeSchema,
} from 'src/schemas/room-type.schema';
import { RoomTypeController } from './room-type.controller';
import { RoomTypeService } from './room-type.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoomType.name,
        schema: RoomTypeSchema,
      },
    ]),
  ],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
})
export class RoomTypeModule {}
