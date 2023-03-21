import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ROOM_STATUS } from 'src/utils/constants';

type RoomDocument = Room & Document;

@Schema({ timestamps: true, collection: 'rooms' })
class Room {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  organization_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  room_type_id: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  max_occupancy: number;

  @Prop({
    required: true,
    type: String,
    enum: [
      ROOM_STATUS.AVAIALBE,
      ROOM_STATUS.MAINTENANCE,
      ROOM_STATUS.UNAVAILABLE,
    ],
    default: ROOM_STATUS.AVAIALBE,
  })
  status: string;

  @Prop({ type: String })
  description: string;
}

const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organization_id',
  foreignField: '_id',
});

RoomSchema.virtual('room_type', {
  ref: 'RoomType',
  localField: 'room_type_id',
  foreignField: '_id',
});

export { RoomDocument, Room, RoomSchema };
