import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

@Schema()
export class Image {
  @Prop()
  name: string;

  @Prop()
  url: string;
}

export const ImageSchema =
  SchemaFactory.createForClass(Image);
