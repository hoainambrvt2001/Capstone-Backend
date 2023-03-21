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
  getListAbnormalEvents(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('organizaton') orgId?: string,
    @Query('room') roomId?: string,
    @Query('type') typeId?: string,
  ) {
    return this.eventService.getEvents(
      limit,
      page,
      orgId,
      roomId,
      typeId,
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
