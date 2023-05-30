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
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  @UseInterceptors(FileInterceptor('avatar_image'))
  createUser(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Body() userDto: UserDto,
    @UploadedFile() avatar_image?: Express.Multer.File,
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.createUser(
      userDto,
      avatar_image,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'face_images', maxCount: 2 },
      { name: 'avatar_image', maxCount: 1 },
    ]),
  )
  updateUserById(
    @GetUser()
    reqUser: { id: string; email: string; role: string },
    @Param('id') userId: string,
    @Body() userDto: UserUpdateDto,
    @UploadedFiles()
    images: {
      face_images?: Express.Multer.File[];
      avatar_images?: Express.Multer.File[];
    },
  ) {
    if (reqUser.role != 'admin')
      throw new ForbiddenException('Forbidden resource');
    return this.userService.updateUserById(
      userId,
      userDto,
      images,
    );
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

  @Get('me/information')
  getMe(@GetUser('id') uid: string) {
    return this.userService.getUserById(uid);
  }

  @Post('me/information')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'face_images', maxCount: 2 },
      { name: 'avatar_images', maxCount: 1 },
    ]),
  )
  updateMe(
    @GetUser('id') uid: string,
    @Body() userDto: UserUpdateDto,
    @UploadedFiles()
    images: {
      face_images?: Express.Multer.File[];
      avatar_images?: Express.Multer.File[];
    },
  ) {
    return this.userService.updateUserById(
      uid,
      userDto,
      images,
    );
  }
}
