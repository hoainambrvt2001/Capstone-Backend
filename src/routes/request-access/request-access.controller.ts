import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import {
  RequestAccessDto,
  RequestAccessUpdateDto,
} from './dto';
import { RequestAccessService } from './request-access.service';

@UseGuards(JwtGuard)
@Controller('request-access')
export class RequestAccessController {
  constructor(
    private requestService: RequestAccessService,
  ) {}

  @Get()
  getListRequests(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('q') queryString?: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.requestService.getListRequests(
      limit,
      page,
      status,
      queryString,
    );
  }

  @Get(':id')
  getRequestById(@Param('id') uid: string) {
    return this.requestService.getRequestById(uid);
  }

  @Get('user/:uid')
  getRequestByUID(@Param('uid') uid: string) {
    return this.requestService.getRequestByUID(uid);
  }

  @Post()
  createRequest(
    @GetUser('id') uid: string,
    @Body() requestAccessDto: RequestAccessDto,
  ) {
    return this.requestService.createRequest(
      requestAccessDto,
      uid,
    );
  }

  @Patch(':id')
  updateRequestById(
    @Param('id') requestId: string,
    @Body() requestAccessDto: RequestAccessUpdateDto,
  ) {
    return this.requestService.updateRequestById(
      requestAccessDto,
      requestId,
    );
  }

  @Delete(':id')
  deleteRequestById(@Param('id') requestId: string) {
    return this.requestService.deleteRequestById(requestId);
  }
}
