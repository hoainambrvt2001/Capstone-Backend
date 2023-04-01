import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto, SocialAuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserDocument,
} from '../../schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { ROLE } from '../../utils/constants';
import { add } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(authDto: AuthDto, isAdmin = false) {
    try {
      // Generate the password hash:
      const hashPassword = await argon.hash(
        authDto.password,
      );
      // Save the new user in the database:
      const user: any = {
        email: authDto.email,
        password: hashPassword,
        name: authDto.name,
        role_id: isAdmin
          ? new mongoose.Types.ObjectId(ROLE.ADMIN)
          : new mongoose.Types.ObjectId(ROLE.SUBSCRIBER),
        phone_number: authDto.phone_number,
        photo_url: authDto.photo_url,
      };
      const createdUser = await this.userModel.create(user);
      // Send back the token:
      return this.signToken({
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        photo_url: createdUser.photo_url,
        phone_number: createdUser.phone_number,
        registered_faces: createdUser.registered_faces,
        role: isAdmin ? 'admin' : 'subscriber',
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Credentials taken');
    }
  }

  async loginInWithGoogle(
    socialAuthDto: SocialAuthDto,
    isAdmin = false,
  ) {
    try {
      // Find the user by email:
      let googleSignInUser = await this.userModel.findOne({
        email: socialAuthDto.email,
      });
      // If user does not exist then create the user:
      if (!googleSignInUser) {
        const googleUserData: any = {
          email: socialAuthDto.email,
          name: socialAuthDto.name,
          role_id: isAdmin
            ? new mongoose.Types.ObjectId(ROLE.ADMIN)
            : new mongoose.Types.ObjectId(ROLE.SUBSCRIBER),
          phone_number: socialAuthDto.phone_number,
          photo_url: socialAuthDto.photo_url,
        };
        googleSignInUser = await this.userModel.create(
          googleUserData,
        );
      }
      // Send back the token:
      return this.signToken(googleSignInUser);
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Credentials taken');
    }
  }

  async loginIn(authDto: AuthDto, isAdmin = false) {
    // Find the user by email:
    const user: any = await this.userModel
      .findOne({
        email: authDto.email,
      })
      .populate('role', '_id name');
    // If user does not exist throw exception:
    if (!user)
      throw new ForbiddenException('Credential incorrect');
    if (user.role.name != 'admin' && isAdmin) {
      throw new ForbiddenException('Credential incorrect');
    }
    // Compare password
    const pwMatches = await argon.verify(
      user.password,
      authDto.password,
    );
    // If password is incorrect throw exception:
    if (!pwMatches)
      throw new ForbiddenException('Credential incorrect');
    // Send back the token
    return this.signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      photo_url: user.photo_url,
      phone_number: user.phone_number,
      registered_faces: user.registered_faces,
      role: user.role.name,
    });
  }

  async getMe(uid: string) {
    // Find the user by id:
    const user: any = await this.userModel
      .findOne({
        _id: uid,
      })
      .populate('role', '_id name');
    // If user does not exist throw exception:
    if (!user)
      throw new ForbiddenException('Invalid user!');

    return {
      status_code: 200,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          photo_url: user.photo_url ? user.photo_url : '',
          phone_number: user.phone_number
            ? user.phone_number
            : '',
          registered_faces: user.registered_faces,
          role: user.role.name,
        },
      },
    };
  }

  async signToken(user: any): Promise<object> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h', // ** 24 hours,
      secret: secret,
    });
    return {
      status_code: 200,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          photo_url: user.photo_url ? user.photo_url : '',
          phone_number: user.phone_number
            ? user.phone_number
            : '',
          registered_faces: user.registered_faces
            ? user.registered_faces
            : [],
        },
        token: token,
        expiration_time: add(new Date(), { days: 1 }),
      },
    };
  }
}
