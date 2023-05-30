import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../schemas/user.schema';
import { EmailModule } from '../../services/email/email.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { StorageModule } from 'src/services/storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    EmailModule,
    StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
