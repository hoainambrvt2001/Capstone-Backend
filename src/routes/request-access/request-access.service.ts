import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  RequestAccess,
  RequestAccessDocument,
} from '../../schemas/request-access.schema';
import {
  RequestAccessDto,
  RequestAccessUpdateDto,
} from './dto';

@Injectable()
export class RequestAccessService {
  constructor(
    @InjectModel(RequestAccess.name)
    private requestModel: Model<RequestAccessDocument>,
  ) {}

  async getListRequests(limit: string, page: string) {
    try {
      //** Determine options in find() */
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      //** Find requests */
      const requests = await this.requestModel
        .find({}, null, options)
        .populate('organization')
        .populate('user');

      //** Calculate total number of requests */
      const totalRequests = await this.requestModel.count(
        {},
      );
      const last_page = Math.ceil(
        totalRequests / options.limit,
      );

      return {
        status: 200,
        data: requests,
        total: totalRequests,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getRequestById(requestId: string) {
    try {
      const request = await this.requestModel
        .findOne({
          _id: requestId,
        })
        .populate('organization')
        .populate('user');
      return {
        status_code: 200,
        data: request,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getRequestByUID(uid: string) {
    try {
      const requests = await this.requestModel
        .find({
          user_id: uid,
        })
        .populate('organization')
        .populate('user');
      return {
        status_code: 200,
        data: requests,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createRequest(
    requestAccessDto: RequestAccessDto,
    uid: string,
  ) {
    try {
      const createdRequest = await this.requestModel.create(
        {
          ...requestAccessDto,
          user_id: new mongoose.Types.ObjectId(uid),
        },
      );
      return {
        status_code: 201,
        data: { id: createdRequest.id, ...createdRequest },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateRequestById(
    requestAccessDto: RequestAccessUpdateDto,
    requestId: string,
  ) {
    try {
      const updatedRequest =
        await this.requestModel.updateOne(
          {
            _id: requestId,
          },
          requestAccessDto,
        );
      return {
        status_code: 201,
        updated_count: updatedRequest.modifiedCount,
        data: { id: requestId, ...requestAccessDto },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteRequestById(requestId: string) {
    try {
      const deletedRequest =
        await this.requestModel.deleteOne({
          _id: requestId,
        });
      return {
        status_code: 201,
        deleted_count: deletedRequest.deletedCount,
        data: {
          id: deletedRequest,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
