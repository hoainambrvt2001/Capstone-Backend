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
import { AccessEventService } from './access-event.service';
import {
  AccessEventDto,
  AccessEventUpdateDto,
} from './dto';

@Controller('access-event')
export class AccessEventController {
  constructor(private eventService: AccessEventService) {}

  @Get()
  getEvents(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('userId') userId?: string,
    @Query('credential') credential?: string,
  ) {
    return this.eventService.getEvents(
      limit,
      page,
      userId,
      credential,
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

  @Patch(':id')
  updateEventById(
    @Param('id') eventId: string,
    @Body() eventDto: AccessEventUpdateDto,
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
