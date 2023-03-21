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
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getListUsers(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('role') role?: string,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.getListUsers(limit, page, role);
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
    if (reqUser.role != 'admin')
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
}
