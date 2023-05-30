import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  StoredImage,
  STORE_STATUS,
} from '../utils/constants';

type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
class User {
  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  photo_url: string;

  @Prop({ type: String })
  phone_number: string;

  @Prop({
    required: true,
    type: [],
  })
  registered_faces: Array<StoredImage>;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
  })
  organization_access_permissions: Array<string>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  role_id: string;

  @Prop({
    required: true,
    enum: STORE_STATUS,
    default: STORE_STATUS.AVAIALBE,
  })
  status: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('role', {
  ref: 'Role',
  localField: 'role_id',
  foreignField: '_id',
  justOne: true,
});

export { UserDocument, User, UserSchema };
