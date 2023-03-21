import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true, collection: 'roles' })
export class Role {
  @Prop({ required: true, unique: true, type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const RoleSchema =
  SchemaFactory.createForClass(Role);
