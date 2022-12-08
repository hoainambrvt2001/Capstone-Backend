import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CREDENTIAL_TYPE } from 'src/utils/constants';
import { ImageSchema } from './common.schema';

export type AccessEventDocument = AccessEvent & Document;

@Schema({ timestamps: true })
export class AccessEvent {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  user: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: string;

  @Prop({
    required: true,
    type: [ImageSchema],
  })
  images: object[];

  @Prop({
    required: true,
    enum: [
      CREDENTIAL_TYPE.APP_QR,
      CREDENTIAL_TYPE.MAIL_QR,
      CREDENTIAL_TYPE.ADMIN_PERMIT,
    ],
  })
  credential: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  time: Date;
}

export const AccessEventSchema =
  SchemaFactory.createForClass(AccessEvent);
