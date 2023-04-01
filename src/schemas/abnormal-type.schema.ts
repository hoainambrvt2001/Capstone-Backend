import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

type AbnormalTypeDocument = AbnormalType & Document;

@Schema({ timestamps: true, collection: 'abnormal_types' })
class AbnormalType {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

const AbnormalTypeSchema =
  SchemaFactory.createForClass(AbnormalType);

export {
  AbnormalTypeDocument,
  AbnormalType,
  AbnormalTypeSchema,
};
