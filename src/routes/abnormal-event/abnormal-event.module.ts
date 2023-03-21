import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalEvent,
  AbnormalEventSchema,
} from '../../schemas/abnormal-event.schema';
import { AbnormalEventController } from './abnormal-event.controller';
import { AbnormalEventService } from './abnormal-event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AbnormalEvent.name,
        schema: AbnormalEventSchema,
      },
    ]),
  ],
  controllers: [AbnormalEventController],
  providers: [AbnormalEventService],
})
export class AbnormalEventModule {}
