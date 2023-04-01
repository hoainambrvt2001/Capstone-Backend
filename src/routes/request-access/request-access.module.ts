import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestAccess,
  RequestAccessSchema,
} from '../../schemas/request-access.schema';
import { RequestAccessController } from './request-access.controller';
import { RequestAccessService } from './request-access.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RequestAccess.name,
        schema: RequestAccessSchema,
      },
    ]),
  ],
  controllers: [RequestAccessController],
  providers: [RequestAccessService],
})
export class RequestAccessModule {}
