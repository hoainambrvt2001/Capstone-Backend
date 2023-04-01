import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

type RoomStatusDocument = RoomStatus & Document;

@Schema({
  timestamps: true,
  collection: 'rooms-status',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
class RoomStatus {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    unique: true,
  })
  room_id: string;

  @Prop({ required: true, type: Number })
  current_occupancy: number;

  @Prop({ required: true, type: Number })
  total_visitor: number;

  @Prop({ required: true, type: Number })
  total_abnormal_events: number;
}

const RoomStatusSchema =
  SchemaFactory.createForClass(RoomStatus);

RoomStatusSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
  justOne: true,
});

export { RoomStatusDocument, RoomStatus, RoomStatusSchema };
