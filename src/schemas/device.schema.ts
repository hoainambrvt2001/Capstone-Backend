import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

type DeviceDocument = Device & Document;

@Schema({ timestamps: true, collection: 'devices' })
class Device {
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
  device_type_id: string;

  @Prop({
    required: true,
    type: String,
  })
  name: string;
}

const DeviceSchema = SchemaFactory.createForClass(Device);

DeviceSchema.virtual('organization', {
  ref: 'Organization',
  localField: 'organization_id',
  foreignField: '_id',
});

DeviceSchema.virtual('room', {
  ref: 'Room',
  localField: 'room_id',
  foreignField: '_id',
});

DeviceSchema.virtual('device_type', {
  ref: 'DeviceType',
  localField: 'device_type_id',
  foreignField: '_id',
});

export { DeviceDocument, Device, DeviceSchema };
