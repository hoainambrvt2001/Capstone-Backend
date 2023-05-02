import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../schemas/user.schema';
import { EmailModule } from '../../services/email/email.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
