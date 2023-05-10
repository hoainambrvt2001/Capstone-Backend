import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from '../../schemas/user.schema';
import {
  ROLE,
  STORE_STATUS,
  StoredImage,
} from '../../utils/constants';
import { UserDto, UserUpdateDto } from './dto';
import { StorageService } from 'src/services/storage/storage.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private storageService: StorageService,
  ) {}

  async getListUsers(
    limit: number,
    page: number,
    role: string,
    queryString: string,
  ) {
    try {
      //** Determine filters in find() */
      const filters: any = {
        status: STORE_STATUS.AVAIALBE,
      };
      if (role === 'admin') filters.role_id = ROLE.ADMIN;
      else if (role === 'manager')
        filters.role_id = ROLE.MANAGER;
      else if (role === 'subscriber')
        filters.role_id = ROLE.SUBSCRIBER;

      if (queryString) {
        filters.name = new RegExp(queryString, 'i');
      }

      //** Determine options in find() */
      const options: any = {
        limit: limit ? limit : 9,
        skip: page ? page - 1 : 0,
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
        status_code: 200,
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

      if (!user)
        throw new ForbiddenException(
          'The user does not exist in the system.',
        );

      return {
        status_code: 200,
        data: user,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createUser(
    userDto: UserDto,
    avatar_image?: Express.Multer.File,
  ) {
    try {
      const createdUser = await this.userModel.create({
        userDto,
      });
      const returnData: any = {
        id: createdUser._id,
        ...userDto,
      };
      if (avatar_image) {
        let uploadedAvatarImage: StoredImage =
          await this.storageService.save(
            `users/${createdUser._id}/avatars/`,
            avatar_image.originalname,
            avatar_image.buffer,
          );
        await this.userModel.updateOne(
          {
            id: createdUser._id,
          },
          {
            photo_url: uploadedAvatarImage.url,
          },
        );
        returnData.photo_url = uploadedAvatarImage.url;
      }
      return {
        status_code: 201,
        data: returnData,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateUserById(
    userId: string,
    userDto: UserUpdateDto,
    images: {
      face_images?: Express.Multer.File[];
      avatar_images?: Express.Multer.File[];
    },
  ) {
    try {
      let uploadedFaceImages: Array<StoredImage> = [];
      if (images.face_images) {
        for (const face_image of images.face_images) {
          const uploadedFaceImage =
            await this.storageService.save(
              `users/${userId}/faces/`,
              `${userId}-${
                uploadedFaceImages.length + 1
              }.jpg`,
              face_image.buffer,
            );
          uploadedFaceImages.push(uploadedFaceImage);
        }
      }
      let uploadedAvatarImages: Array<StoredImage> = [];
      if (images.avatar_images) {
        for (const avatar_image of images.avatar_images) {
          const uploadedAvatarImage =
            await this.storageService.save(
              `users/${userId}/avatars/`,
              avatar_image.originalname,
              avatar_image.buffer,
            );
          uploadedAvatarImages.push(uploadedAvatarImage);
        }
      }
      const updatedUserData = { ...userDto };
      if (uploadedAvatarImages.length != 0)
        updatedUserData.photo_url =
          uploadedAvatarImages[0].url;
      if (uploadedFaceImages.length != 0)
        updatedUserData.registered_faces =
          uploadedFaceImages;
      const updatedUser = await this.userModel.updateOne(
        {
          _id: userId,
        },
        updatedUserData,
      );
      return {
        status_code: 201,
        data: { id: userId, ...updatedUserData },
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
