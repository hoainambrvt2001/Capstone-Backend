import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

type DeviceTypeDocument = DeviceType & Document;

@Schema({ timestamps: true, collection: 'device_types' })
class DeviceType {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

const DeviceTypeSchema =
  SchemaFactory.createForClass(DeviceType);

export { DeviceTypeDocument, DeviceType, DeviceTypeSchema };
