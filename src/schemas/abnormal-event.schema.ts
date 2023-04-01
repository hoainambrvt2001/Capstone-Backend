import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  ABNORMAL_EVENT_TYPE,
  StoredImage,
} from '../../src/utils/constants';

type AbnormalEventDocument = AbnormalEvent & Document;

@Schema({
  timestamps: true,
  collection: 'abnormal_events',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
class AbnormalEvent {
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
    enum: ABNORMAL_EVENT_TYPE,
    default: ABNORMAL_EVENT_TYPE.OTHER,
    type: mongoose.Schema.Types.ObjectId,
  })
  abnormal_type_id: string;

  @Prop({
    required: true,
    type: [],
  })
  images: Array<StoredImage>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  occurred_time: Date;

  @Prop({ type: String })
  note: string;
}

const AbnormalEventSchema =
  SchemaFactory.createForClass(AbnormalEvent);

AbnormalEventSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organization_id',
  foreignField: '_id',
  justOne: true,
});

AbnormalEventSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
  justOne: true,
});

AbnormalEventSchema.virtual('abnormal_type', {
  ref: 'AbnormalType',
  localField: 'abnormal_type_id',
  foreignField: '_id',
  justOne: true,
});

export {
  AbnormalEventDocument,
  AbnormalEvent,
  AbnormalEventSchema,
};
