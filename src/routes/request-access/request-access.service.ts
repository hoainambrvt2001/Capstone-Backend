import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
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
import { MqttService } from 'src/services/mqtt/mqtt.service';
import { REQUEST_ACCESS_STATUS } from 'src/utils/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestAccessService {
  constructor(
    @InjectModel(RequestAccess.name)
    private requestModel: Model<RequestAccessDocument>,

    private configService: ConfigService,

    private mqttService: MqttService,
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

      //** Query requests by user_name */
      if (queryString)
        filters.user_name = new RegExp(queryString, 'i');

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
        filters,
      );
      const last_page = Math.ceil(
        totalRequests / options.limit,
      );

      return {
        status_code: 200,
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
      const requestAccessData = {
        organization_id: requestAccessDto.organization_id,
        user_id: new mongoose.Types.ObjectId(uid),
        user_name: requestAccessDto.user_name,
        requested_time: requestAccessDto.requested_time,
        note: requestAccessDto.note,
        status: REQUEST_ACCESS_STATUS.PENDING,
      };
      // Check if the request of that user is pending or accepted:
      const previous_requests: Array<any> =
        await this.requestModel.find({
          organization_id:
            requestAccessData.organization_id,
          user_id: requestAccessData.user_id,
        });
      let isPendingOrAccepted = false;
      for (const previous_request of previous_requests) {
        if (
          previous_request.status ===
          REQUEST_ACCESS_STATUS.PENDING
        ) {
          isPendingOrAccepted = true;
          break;
        }
      }
      if (isPendingOrAccepted) {
        throw new BadRequestException(
          'Your access-request has been pending or accepted.',
        );
      }
      // Store a new request to MongoDB:
      const createdRequest = await this.requestModel.create(
        requestAccessData,
      );
      // Notify the hardware about new user:
      const topic = this.configService.get<string>(
        'ADAFRUIT_MQTT_HARDWARE_TOPIC',
      );
      const message = JSON.stringify({
        type: 'NEW_USER_REGISTER',
        data: {
          user_id: uid,
          user_name: requestAccessDto.user_name,
          registered_face_images:
            requestAccessDto.registered_face_images,
        },
      });
      await this.mqttService.publish(topic, message);
      return {
        status_code: 201,
        data: {
          request_id: createdRequest.id,
          ...requestAccessData,
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
