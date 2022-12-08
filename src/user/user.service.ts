import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from 'src/schemas/user.schema';
import { STORE_STATUS } from 'src/utils/constants';
import { UserDto, UserUpdateDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getUsers(
    limit: string,
    page: string,
    role: string,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (role) filters.role = role;

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find users
      const users = await this.userModel
        .find(filters, null, options)
        .select('-hash_password');

      // Calculate total users
      const totalUser = await this.userModel.count(filters);
      const last_page = Math.ceil(
        totalUser / options.limit,
      );

      return {
        status: 200,
        data: users,
        total: totalUser,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel
        .findOne({
          _id: userId,
        })
        .select('-hash_password');
      return {
        status_code: 200,
        data: user,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createUser(userDto: UserDto) {
    try {
      const password = userDto.email.split('@')[0];
      const hash_password = await argon.hash(password);
      const createdUser = await this.userModel.create({
        ...userDto,
        hash_password,
      });
      return {
        status_code: 201,
        data: { _id: createdUser._id, ...userDto },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUserById(
    userId: string,
    userDto: UserUpdateDto,
  ) {
    try {
      const updatedUser = await this.userModel.updateOne(
        {
          _id: userId,
        },
        userDto,
      );
      return {
        status_code: 201,
        updated_count: updatedUser.modifiedCount,
        data: { _id: userId, ...userDto },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteUserById(userId: string) {
    try {
      const deletedUser = await this.userModel.updateOne(
        {
          _id: userId,
        },
        {
          status: STORE_STATUS.UNAVAILABLE,
        },
      );
      return {
        status_code: 201,
        deleted_count: deletedUser.modifiedCount,
        data: {
          _id: userId,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
