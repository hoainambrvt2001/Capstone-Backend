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
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.getUsers(limit, page, role);
  }

  @Get(':id')
  getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Post()
  createUser(@Body() userDto: UserDto) {
    return this.userService.createUser(userDto);
  }

  @Patch(':id')
  updateUserById(
    @Param('id') userId: string,
    @Body() userDto: UserUpdateDto,
  ) {
    return this.userService.updateUserById(userId, userDto);
  }

  @Delete(':id')
  deleteUserById(@Param('id') userId: string) {
    return this.userService.deleteUserById(userId);
  }
}
