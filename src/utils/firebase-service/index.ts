import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;

  constructor(private configService: ConfigService) {
    // Init Firebase Service:
    this.app = initializeApp({
      apiKey: configService.get<string>('FIREBASE_API_KEY'),
      authDomain: configService.get<string>(
        'FIREBASE_AUTH_DOMAIN',
      ),
      projectId: configService.get<string>(
        'FIREBASE_PROJECT_ID',
      ),
      storageBucket: configService.get<string>(
        'FIREBASE_STORAGE_BUCKET',
      ),
      messagingSenderId: configService.get<string>(
        'FIREBASE_MESSAGING_SENDER_ID',
      ),
      appId: configService.get<string>('FIREBASE_APP_ID'),
    });
    this.auth = getAuth(this.app);
  }
}
