import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessEventModule } from './access-event/access-event.module';
import { AbnormalEventModule } from './abnormal-event/abnormal-event.module';
import { RoomModule } from './room/room.module';
import { FirebaseAuthModule } from './firebase-auth/firebase-auth.module';

const config: ConfigService = new ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(config.get('DATABASE_URL')),
    AuthModule,
    UserModule,
    AccessEventModule,
    AbnormalEventModule,
    RoomModule,
    FirebaseAuthModule,
  ],
})
export class AppModule {}
