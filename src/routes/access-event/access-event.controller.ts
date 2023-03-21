import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AccessEventService } from './access-event.service';
import { AccessEventDto } from './dto';

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
  createEvent(@Body() eventDto: AccessEventDto) {
    return this.eventService.createEvent(eventDto);
  }

  @Delete(':id')
  deleteEventById(@Param('id') eventId: string) {
    return this.eventService.deleteEventById(eventId);
  }
}
