import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ROOM_STATUS,
  ROOM_TYPE,
} from 'src/utils/constants';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  building: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({
    required: true,
    enum: [ROOM_TYPE.PUBLIC, ROOM_TYPE.PRIVATE],
    default: ROOM_TYPE.PUBLIC,
  })
  type: string;

  @Prop({
    required: true,
    enum: [
      ROOM_STATUS.AVAIALBE,
      ROOM_STATUS.MAINTENANCE,
      ROOM_STATUS.UNAVAILABLE,
    ],
    default: ROOM_STATUS.AVAIALBE,
  })
  status: string;

  @Prop()
  description: string;
}

export const RoomSchema =
  SchemaFactory.createForClass(Room);
