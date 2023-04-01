import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { StoredImage } from '../utils/constants';

type AccessEventDocument = AccessEvent & Document;

@Schema({
  timestamps: true,
  collection: 'access_events',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
class AccessEvent {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  organization_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  room_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    type: [],
  })
  images: Array<StoredImage>;

  @Prop({
    required: true,
    type: Boolean,
  })
  is_guest: boolean;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  accessed_time: Date;
}

const AccessEventSchema =
  SchemaFactory.createForClass(AccessEvent);

AccessEventSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
  justOne: true,
});

AccessEventSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organization_id',
  foreignField: '_id',
  justOne: true,
});

AccessEventSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

export {
  AccessEventDocument,
  AccessEvent,
  AccessEventSchema,
};
