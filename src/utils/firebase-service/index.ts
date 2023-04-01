import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@firebase/storage';
import { StoredImage } from '../constants';

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

  async uploadImage(
    file: Express.Multer.File,
    store_path: string,
  ): Promise<StoredImage> {
    const storage = getStorage(this.app);
    const imageRef = ref(
      storage,
      `${store_path}/${file.originalname}`,
    );
    const metadata = {
      contentType: file.mimetype,
    };
    await uploadBytes(imageRef, file.buffer, metadata);
    const downloadURL = await getDownloadURL(imageRef);
    return {
      name: file.originalname,
      url: downloadURL,
    };
  }

  async uploadImagesToFirebase(
    files: Array<Express.Multer.File>,
    store_path: string,
  ): Promise<Array<StoredImage>> {
    const uploadFiles: Array<StoredImage> = [];
    if (!files) return uploadFiles;
    for (const file of files) {
      const uploadFile = await this.uploadImage(
        file,
        store_path,
      );
      uploadFiles.push(uploadFile);
    }
    return uploadFiles;
  }
}
