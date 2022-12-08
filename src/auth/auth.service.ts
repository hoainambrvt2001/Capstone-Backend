import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(authDto: AuthDto) {
    // ** Generate the password hash
    const hashPassword = await argon.hash(authDto.password);

    try {
      // ** Save the new user in the database
      const createdUser = await this.userModel.create({
        email: authDto.email,
        hash_password: hashPassword,
        first_name: authDto.first_name,
        last_name: authDto.last_name,
        avatar: {
          name: '',
          url: '',
        },
        company: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address: '',
      });

      // ** Send back the token
      return this.signToken(
        createdUser.id,
        createdUser.email,
      );
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Credentials taken');
    }
  }

  async signin(authDto: AuthDto) {
    // ** Find the user by email
    const user = await this.userModel.findOne({
      email: authDto.email,
    });

    // ** If user does not exist throw exception
    if (!user)
      throw new ForbiddenException('Credential incorrect');

    // ** Compare password
    const pwMatches = await argon.verify(
      user.hash_password,
      authDto.password,
    );

    // ** If password is incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException('Credential incorrect');

    // ** Send back the token
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<object> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h', // ** 24 hours,
      secret: secret,
    });

    const user = await this.userModel.findOne({
      _id: userId,
    });

    return {
      status_code: 200,
      data: {
        access_token: token,
        expired_in: 1,
        user_id: userId,
        username: email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    };
  }
}
