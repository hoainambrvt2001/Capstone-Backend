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
import { AbnormalEventService } from './abnormal-event.service';
import {
  AbnormalEventDto,
  AbnormalEventUpdateDto,
} from './dto';
@UseGuards(JwtGuard)
@Controller('abnormal-event')
export class AbnormalEventController {
  constructor(private eventService: AbnormalEventService) {}

  @Get()
  getListAbnormalEvents(
    @GetUser('role')
    reqUser: { id: string; email: string; role: string },
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('organizaton') orgId?: string,
    @Query('room') roomId?: string,
    @Query('type') typeId?: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.getEvents(
      limit,
      page,
      orgId,
      roomId,
      typeId,
    );
  }

  @Get(':id')
  getEventById(
    @GetUser('role')
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.getEventById(eventId);
  }

  @Post()
  createEvent(
    @GetUser('role')
    reqUser: { id: string; email: string; role: string },
    @Body() eventDto: AbnormalEventDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.createEvent(eventDto);
  }

  @Patch(':id')
  updateEventById(
    @GetUser('role')
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
    @Body() eventDto: AbnormalEventUpdateDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.updateEventById(
      eventId,
      eventDto,
    );
  }

  @Delete(':id')
  deleteEventById(
    @GetUser('role')
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.deleteEventById(eventId);
  }
}
