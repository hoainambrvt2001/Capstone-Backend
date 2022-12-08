import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccessEvent,
  AccessEventSchema,
} from 'src/schemas/access-event.schema';
import { AccessEventController } from './access-event.controller';
import { AccessEventService } from './access-event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccessEvent.name, schema: AccessEventSchema },
    ]),
  ],
  controllers: [AccessEventController],
  providers: [AccessEventService],
})
export class AccessEventModule {}
