import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../schemas/user.schema';
import { MailHelperModule } from '../mail-helper/mail-helper.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    MailHelperModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
