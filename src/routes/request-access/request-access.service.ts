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

  async getListRequests(
    limit: number,
    page: number,
    status: string,
    queryString: string,
  ) {
    try {
      //** Determine filters in find() */
      const filters: any = {};
      if (status) filters.status = status;

      //** Determine options in find() */
      const options: any = {
        limit: limit ? limit : 9,
        skip: page ? page - 1 : 0,
      };

      //** Determine conditions in populate('user') */
      // const matches: any = {};
      // if (queryString) {
      //   const reg = new RegExp(queryString, 'i');
      //   matches.name = reg;
      // }

      //** Find requests */
      const requests = await this.requestModel
        .find(filters, null, options)
        .populate('organization', '_id name')
        .populate({
          path: 'user',
          select:
            '_id name email photo_url registered_faces',
        })
        .select('-__v');

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
        .populate('organization', '_id name')
        .populate(
          'user',
          '_id name email photo_url registered_faces',
        )
        .select('-__v');
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
        .populate('organization', '_id name')
        .populate(
          'user',
          '_id name photo_url registered_faces',
        )
        .select('-__v');
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
        data: {
          id: createdRequest.id,
          ...requestAccessDto,
          status: 'pending',
        },
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
