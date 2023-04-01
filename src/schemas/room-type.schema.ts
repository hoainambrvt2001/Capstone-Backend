import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

type RoomTypeDocument = RoomType & Document;

@Schema({ timestamps: true, collection: 'room_types' })
class RoomType {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

const RoomTypeSchema =
  SchemaFactory.createForClass(RoomType);

export { RoomTypeDocument, RoomType, RoomTypeSchema };
