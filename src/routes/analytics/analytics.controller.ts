import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('/room-status/:id')
  getRoomStatus(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getRoomStatus(roomId);
  }

  @Get('/visitors-by-day/:id')
  getVisitorsByDay(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getVisitorsByDay(roomId);
  }

  @Get('/abnormal-events/:id')
  getAbnormalEvents(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
    @Query('mode') mode: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getAbnormalEvents(
      roomId,
      mode,
    );
  }
}
