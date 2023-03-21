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
import { UseGuards } from '@nestjs/common/decorators';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { RoomDto, RoomUpdateDto } from './dto';
import { RoomService } from './room.service';

@UseGuards(JwtGuard)
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('search')
  searchRoom(
    @Query('s') queryString: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.roomService.search(
      queryString,
      page,
      limit,
    );
  }

  @Get()
  getListRooms(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('type') type_id?: string,
    @Query('status') status?: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.roomService.getListRooms(
      limit,
      page,
      type_id,
      status,
    );
  }

  @Get(':id')
  getRoomById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.roomService.getRoomById(roomId);
  }

  @Post()
  createRoom(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() roomDto: RoomDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.roomService.createRoom(roomDto);
  }

  @Patch(':id')
  updateRoomById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
    @Body() roomDto: RoomUpdateDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.roomService.updateRoomById(roomId, roomDto);
  }

  @Delete(':id')
  deleteRoomById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.roomService.deleteRoomById(roomId);
  }
}
