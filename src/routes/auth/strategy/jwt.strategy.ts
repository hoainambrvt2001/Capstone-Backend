import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'dacn-jwt',
) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // ** Run before the Controller get the request
  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
