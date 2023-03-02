import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseAuthController } from './firebase-auth.controller';
import { FirebaseAuthService } from './firebase-auth.service';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseAuthController],
  providers: [FirebaseAuthService, FirebaseService],
})
export class FirebaseAuthModule {}
