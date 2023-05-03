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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    @Query('sort') sort?: string,
  ) {
    return this.eventService.getListAccessEvents(
      limit,
      page,
      uid,
      orgId,
      roomId,
      guest,
      sort,
    );
  }

  @Get(':id')
  getEventById(@Param('id') eventId: string) {
    return this.eventService.getEventById(eventId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('event_images'))
  createEvent(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() eventDto: AccessEventDto,
    @UploadedFiles()
    event_images?: Array<Express.Multer.File>,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.createEvent(
      eventDto,
      event_images,
    );
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

  @Patch('/checkout/:id')
  updateCheckoutEvent(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') room_id: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.updateCheckoutEvent(room_id);
  }
}
