import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AuthModule } from './routes/auth/auth.module';
import { UserModule } from './routes/user/user.module';
import { AccessEventModule } from './routes/access-event/access-event.module';
import { AbnormalEventModule } from './routes/abnormal-event/abnormal-event.module';
import { RoleModule } from './routes/role/role.module';
import { RequestAccessModule } from './routes/request-access/request-access.module';
import { OrganizationModule } from './routes/organization/organization.module';
import { RoomModule } from './routes/room/room.module';

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
    RoleModule,
    RequestAccessModule,
    OrganizationModule,
    RoomModule,
  ],
})
export class AppModule {}
