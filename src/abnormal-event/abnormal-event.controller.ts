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
import { AbnormalEventService } from './abnormal-event.service';
import {
  AbnormalEventDto,
  AbnormalEventUpdateDto,
} from './dto';

@Controller('abnormal-event')
export class AbnormalEventController {
  constructor(private eventService: AbnormalEventService) {}

  @Get()
  getEvents(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('building') building?: string,
    @Query('room') room?: string,
    @Query('type') type?: string,
  ) {
    return this.eventService.getEvents(
      limit,
      page,
      building,
      room,
      type,
    );
  }

  @Get(':id')
  getEventById(@Param('id') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Post()
  createEvent(@Body() eventDto: AbnormalEventDto) {
    return this.eventService.createEvent(eventDto);
  }

  @Patch(':id')
  updateEventById(
    @Param('id') eventId: string,
    @Body() eventDto: AbnormalEventUpdateDto,
  ) {
    return this.eventService.updateEventById(
      eventId,
      eventDto,
    );
  }

  @Delete(':id')
  deleteEventById(@Param('id') eventId: string) {
    return this.eventService.deleteEventById(eventId);
  }
}
