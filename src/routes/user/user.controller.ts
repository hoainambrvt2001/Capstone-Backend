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
import { MailHelperService } from '../mail-helper/mail-helper.service';
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private mailHelperService: MailHelperService,
  ) {}

  @Get()
  getListUsers(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Query('limit') limit?: number,
    @Query('page') page?: number,
    @Query('role') role?: string,
    @Query('q') queryString?: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.getListUsers(
      limit,
      page,
      role,
      queryString,
    );
  }

  @Get(':id')
  getUserById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') uid: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.getUserById(uid);
  }

  @Post()
  createUser(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() userDto: UserDto,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.createUser(userDto);
  }

  @Patch(':id')
  updateUserById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') userId: string,
    @Body() userDto: UserUpdateDto,
  ) {
    const cond1 = reqUser.role != 'admin';
    const cond2 = reqUser.id != userId;
    if (cond1 && cond2)
      throw new ForbiddenException('Forbidden resource');
    return this.userService.updateUserById(userId, userDto);
  }

  @Delete(':id')
  deleteUserById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') userId: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.deleteUserById(userId);
  }

  @Get('send/email-confirmation')
  sendUserConfirmation(
    @GetUser()
    reqUser: {
      id: string;
      email: string;
      role: string;
    },
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.mailHelperService.sendUserConfirmation(
      reqUser.email,
    );
  }
}
