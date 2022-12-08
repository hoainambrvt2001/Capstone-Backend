import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ScheduleEventDocument = ScheduleEvent &
  Document;

@Schema({ timestamps: true })
export class ScheduleEvent {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  })
  room: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    required: true,
  })
  is_all_day: boolean;

  @Prop({
    required: true,
    type: [
      {
        type: mongoose.Schema.Types.String,
      },
    ],
  })
  guests: object[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  start_time: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  })
  end_time: Date;

  @Prop()
  description: string;
}

export const ScheduleEventSchema =
  SchemaFactory.createForClass(ScheduleEvent);
