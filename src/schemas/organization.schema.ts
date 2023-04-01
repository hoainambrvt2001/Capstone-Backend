import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';

type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true, collection: 'organizations' })
class Organization {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  logo_url: string;

  @Prop({ required: true, type: String })
  phone_number: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  province: string;

  @Prop({ required: true, type: String })
  district: string;

  @Prop({ required: true, type: String })
  ward: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ type: String })
  description: string;
}

const OrganizationSchema =
  SchemaFactory.createForClass(Organization);

export {
  OrganizationDocument,
  Organization,
  OrganizationSchema,
};
