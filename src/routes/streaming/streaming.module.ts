import { Module } from '@nestjs/common';
import { StreamingController } from './streaming.controller';
import { StreamingGateWay } from './streaming.gateway';
import { StreamingService } from './streaming.service';

@Module({
  controllers: [StreamingController],
  providers: [StreamingService, StreamingGateWay],
})
export class StreamingModule {}
