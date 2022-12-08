import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  GENDER,
  ROLES,
  STORE_STATUS,
} from '../../src/utils/constants';
import { ImageSchema } from './common.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hash_password: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({
    type: ImageSchema,
  })
  avatar: object;

  @Prop()
  company: string;

  @Prop()
  phone: string;

  @Prop({
    required: true,
    enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
    default: GENDER.MALE,
  })
  gender: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  birthdate: Date;

  @Prop()
  province: string;

  @Prop()
  district: string;

  @Prop()
  ward: string;

  @Prop()
  address: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: ROLES.SUBSCRIBER,
  })
  role: string;

  @Prop({
    required: true,
    enum: [STORE_STATUS.AVAIALBE, STORE_STATUS.UNAVAILABLE],
    default: STORE_STATUS.AVAIALBE,
  })
  status: string;
}

export const UserSchema =
  SchemaFactory.createForClass(User);
