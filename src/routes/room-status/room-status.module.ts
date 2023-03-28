import { Module } from '@nestjs/common';
import { RoomStatusController } from './room-status.controller';
import { RoomStatusService } from './room-status.service';

@Module({
  controllers: [RoomStatusController],
  providers: [RoomStatusService]
})
export class RoomStatusModule {}
