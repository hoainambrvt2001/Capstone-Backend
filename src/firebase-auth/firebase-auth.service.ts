import { Injectable } from '@nestjs/common';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable()
export class FirebaseAuthService {
  constructor(private firebaseService: FirebaseService) {
    // Firebase Service:
  }

  async signin(body: any) {
    const userCredential = await signInWithEmailAndPassword(
      this.firebaseService.auth,
      body.email,
      body.password,
    );
    if (userCredential) {
      // TODO: Login user successfully:
      return {
        statusCode: 200,
        userCredential,
      };
    }
  }

  async signup(body: any) {
    const userCredential: UserCredential =
      await createUserWithEmailAndPassword(
        this.firebaseService.auth,
        body.email,
        body.password,
      );

    if (userCredential) {
      // TODO: Add the user to MongoDB:
      return {
        statusCode: 201,
        userCredential,
      };
    }
  }
}
