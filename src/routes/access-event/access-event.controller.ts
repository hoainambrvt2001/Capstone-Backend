import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AccessEventService } from './access-event.service';
import {
  AccessEventDto,
  AccessEventUpdateDto,
} from './dto';

@UseGuards(JwtGuard)
@Controller('access-event')
export class AccessEventController {
  constructor(private eventService: AccessEventService) {}

  @Get()
  getListAccessEvents(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('uid') uid?: string,
    @Query('organization') orgId?: string,
    @Query('room') roomId?: string,
    @Query('guest') guest?: boolean,
  ) {
    return this.eventService.getListAccessEvents(
      limit,
      page,
      uid,
      orgId,
      roomId,
      guest,
    );
  }

  @Get(':id')
  getEventById(@Param('id') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Post()
  createEvent(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() eventDto: AccessEventDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.createEvent(eventDto);
  }

  @Patch(':id')
  updateEventById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
    @Body() eventDto: AccessEventUpdateDto,
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
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.deleteEventById(eventId);
  }
}
