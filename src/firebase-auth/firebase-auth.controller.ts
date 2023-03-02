import { Body, Controller, Post } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';

@Controller('firebase-auth')
export class FirebaseAuthController {
  constructor(
    private firebaseAuthSerivde: FirebaseAuthService,
  ) {}

  @Post('signin')
  public signin(@Body() body: any) {
    return this.firebaseAuthSerivde.signin(body);
  }

  @Post('signup')
  public signup(@Body() body: any) {
    return this.firebaseAuthSerivde.signup(body);
  }
}
