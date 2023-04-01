import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ForbiddenException,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
    @GetUser()
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
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.getEventById(eventId);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('event_images'))
  createEvent(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() eventDto: AbnormalEventDto,
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
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') eventId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.eventService.deleteEventById(eventId);
  }
}
