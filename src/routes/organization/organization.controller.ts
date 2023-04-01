import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { OrganizationService } from './organization.service';

@UseGuards(JwtGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private orgService: OrganizationService) {}

  @Get('search')
  searchOrganization(
    @Query('s') queryString: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orgService.search(queryString, page, limit);
  }
}
