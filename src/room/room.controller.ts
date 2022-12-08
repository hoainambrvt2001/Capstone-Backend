import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { RoomDto, RoomUpdateDto } from './dto';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  getRooms(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('type') type?: string,
    @Query('building') building?: string,
    @Query('status') status?: string,
  ) {
    return this.roomService.getRooms(
      limit,
      page,
      type,
      building,
      status,
    );
  }

  @Get('/building')
  getBuildings() {
    return this.roomService.getBuildings();
  }

  @Get(':id')
  getRoomById(@Param('id') roomId: string) {
    return this.roomService.getRoomById(roomId);
  }

  @Post()
  createRoom(@Body() roomDto: RoomDto) {
    return this.roomService.createRoom(roomDto);
  }

  @Patch(':id')
  updateRoomById(
    @Param('id') roomId: string,
    @Body() roomDto: RoomUpdateDto,
  ) {
    return this.roomService.updateRoomById(roomId, roomDto);
  }

  @Delete(':id')
  deleteRoomById(@Param('id') roomId: string) {
    return this.roomService.deleteRoomById(roomId);
  }
}
