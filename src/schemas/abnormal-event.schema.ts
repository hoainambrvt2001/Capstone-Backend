import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ABNORMAL_EVENT_TYPE } from '../../src/utils/constants';

type AbnormalEventDocument = AbnormalEvent & Document;

@Schema({ timestamps: true, collection: 'abnormal_events' })
class AbnormalEvent {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  room_id: string;

  @Prop({
    required: true,
    enum: [
      ABNORMAL_EVENT_TYPE.STRANGER,
      ABNORMAL_EVENT_TYPE.OVERCROWD,
      ABNORMAL_EVENT_TYPE.FIRE,
      ABNORMAL_EVENT_TYPE.OTHER,
    ],
  })
  abnormal_type_id: string;

  @Prop({
    required: true,
    type: [String],
  })
  images: object[];

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
});

AbnormalEventSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
});

AbnormalEventSchema.virtual('abnormal_type', {
  ref: 'AbnormalType',
  localField: 'abnormal_type_id',
  foreignField: '_id',
});

export {
  AbnormalEventDocument,
  AbnormalEvent,
  AbnormalEventSchema,
};
