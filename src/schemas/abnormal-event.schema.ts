import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ABNORMAL_EVENT_TYPE } from '../../src/utils/constants';
import { ImageSchema } from './common.schema';

export type AbnormalEventDocument = AbnormalEvent &
  Document;

@Schema({ timestamps: true })
export class AbnormalEvent {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: string;

  @Prop({
    required: true,
    enum: [
      ABNORMAL_EVENT_TYPE.STRANGER,
      ABNORMAL_EVENT_TYPE.OVERCROWD,
      ABNORMAL_EVENT_TYPE.FIRE,
      ABNORMAL_EVENT_TYPE.OTHER,
    ],
  })
  type: string;

  @Prop({
    required: true,
    type: [ImageSchema],
  })
  images: object[];

  @Prop()
  note: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  time: Date;

  @Prop({
    required: true,
    default: false,
  })
  is_checked: boolean;
}

export const AbnormalEventSchema =
  SchemaFactory.createForClass(AbnormalEvent);
