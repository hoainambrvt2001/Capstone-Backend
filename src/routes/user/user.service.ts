import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from '../../schemas/user.schema';
import { ROLE, STORE_STATUS } from '../../utils/constants';
import { UserDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async getListUsers(
    limit: string,
    page: string,
    role: string,
  ) {
    try {
      //** Determine filters in find() */
      const filters: any = {};
      if (role === 'admin') filters.role_id = ROLE.ADMIN;
      else if (role === 'manager')
        filters.role_id = ROLE.MANAGER;
      else if (role === 'subscriber')
        filters.role_id = ROLE.SUBSCRIBER;

      //** Determine options in find() */
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      //** Find users */
      const users = await this.userModel
        .find(filters, null, options)
        .populate('role', 'name')
        .select('-password -__v');

      //** Calculate total number of users */
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

  async getUserById(uid: string) {
    try {
      const user = await this.userModel
        .findOne({
          _id: uid,
        })
        .populate('role', 'name')
        .select('-password -__v');

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
      const createdUser = await this.userModel.create({
        userDto,
      });
      return {
        status_code: 201,
        data: { id: createdUser.id, ...userDto },
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
        data: { id: userId, ...userDto },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteUserById(userId: string) {
    try {
      const deletedUser = await this.userModel.deleteOne({
        _id: userId,
      });
      return {
        status_code: 201,
        deleted_count: deletedUser.deletedCount,
        data: {
          id: userId,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
