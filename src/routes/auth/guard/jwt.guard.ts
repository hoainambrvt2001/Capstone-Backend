import { AuthGuard } from '@nestjs/passport';

// ** 'dacn-jwt' is a string that AuthGuard() will find the corresponding PassportStrategy in jwt.strategy.ts
export class JwtGuard extends AuthGuard('dacn-jwt') {
  constructor() {
    super();
  }
}
