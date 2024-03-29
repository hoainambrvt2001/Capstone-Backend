import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto';
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
import * as generator from 'generate-password';

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
      const user = {
        email: authDto.email,
        password: hashPassword,
        name: authDto.name,
        phone_number: authDto.phone_number,
        photo_url: authDto.photo_url,
        registered_faces: [],
        organization_access_permissions: [],
        role_id: isAdmin
          ? new mongoose.Types.ObjectId(ROLE.ADMIN)
          : new mongoose.Types.ObjectId(ROLE.SUBSCRIBER),
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
        organization_access_permissions:
          createdUser.organization_access_permissions,
        role: isAdmin ? 'admin' : 'subscriber',
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Credentials taken.');
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
      throw new ForbiddenException('Credential incorrect.');
    if (user.role.name != 'admin' && isAdmin) {
      throw new ForbiddenException('Credential incorrect.');
    }
    // Compare password
    const pwMatches = await argon.verify(
      user.password,
      authDto.password,
    );
    // If password is incorrect throw exception:
    if (!pwMatches)
      throw new ForbiddenException('Credential incorrect.');
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

  async registerHardware(hardwareDto: {
    id: string;
    name: string;
  }) {
    try {
      // Generate the random password for hardware user:
      const password = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        strict: true,
      });
      const hashPassword = await argon.hash(password);
      // Save the new user in the database:
      const hardwareUser = {
        email: `${hardwareDto.name
          .replace(/\s/g, '')
          .toLowerCase()}-${hardwareDto.id}@example.com`,
        password: hashPassword,
        name: hardwareDto.name,
        phone_number: '',
        photo_url: '',
        registered_faces: [],
        organization_access_permissions: [],
        role_id: new mongoose.Types.ObjectId(ROLE.ADMIN),
      };
      const createdHardwareUser =
        await this.userModel.create(hardwareUser);
      // Send back the token:
      const secret = this.config.get('JWT_SECRET');
      const token = await this.jwt.signAsync(
        {
          sub: createdHardwareUser.id,
          email: createdHardwareUser.email,
          role: 'admin',
        },
        {
          secret: secret,
        },
      );
      return {
        status_code: 201,
        data: {
          token: token,
          organization_id: '6413ebf956917f74591468fa',
          room_id: '6413ebf956917f74591468fd',
        },
      };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('Credentials taken.');
    }
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
          organization_access_permissions:
            user.organization_access_permissions
              ? user.organization_access_permissions
              : [],
        },
        token: token,
        expiration_time: add(new Date(), { days: 1 }),
      },
    };
  }
}
