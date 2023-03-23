import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbnormalType,
  AbnormalTypeSchema,
} from 'src/schemas/abnormal-type.schema';
import { FirebaseService } from 'src/utils/firebase-service';
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
      {
        name: AbnormalType.name,
        schema: AbnormalTypeSchema,
      },
    ]),
  ],
  controllers: [AbnormalEventController],
  providers: [AbnormalEventService, FirebaseService],
})
export class AbnormalEventModule {}
