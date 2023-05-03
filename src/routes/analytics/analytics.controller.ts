import {
  CacheInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/all-reports/:id')
  getAllReports(
    @GetUser()
    reqUser: {
      id: string;
      email: string;
      role: string;
    },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getAllReports(roomId);
  }

  @Get('/visitors-by-day/:id')
  @UseInterceptors(CacheInterceptor)
  getVisitorsByDayReport(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getVisitorsByDayReport(
      roomId,
    );
  }

  @Get('/abnormal-events/:id')
  @UseInterceptors(CacheInterceptor)
  getAbnormalEventsReport(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') roomId: string,
    @Query('mode') mode: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.analyticsService.getAbnormalEventsReport(
      roomId,
      mode,
    );
  }
}
