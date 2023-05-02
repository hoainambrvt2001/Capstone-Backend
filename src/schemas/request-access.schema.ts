import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { REQUEST_ACCESS_STATUS } from '../utils/constants';

type RequestAccessDocument = RequestAccess & Document;

@Schema({
  timestamps: true,
  collection: 'request_accesses',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
class RequestAccess {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  organization_id: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  user_id: string;

  @Prop({
    required: true,
    type: String,
  })
  user_name: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  requested_time: Date;

  @Prop({
    required: true,
    type: String,
    enum: REQUEST_ACCESS_STATUS,
    default: REQUEST_ACCESS_STATUS.PENDING,
  })
  status: string;

  @Prop({ type: String })
  note: string;
}

const RequestAccessSchema =
  SchemaFactory.createForClass(RequestAccess);

RequestAccessSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organization_id',
  foreignField: '_id',
  justOne: true,
});

RequestAccessSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

export {
  RequestAccessDocument,
  RequestAccess,
  RequestAccessSchema,
};
