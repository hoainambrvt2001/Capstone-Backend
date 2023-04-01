import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from '@firebase/storage';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  RoomStatus,
  RoomStatusDocument,
} from 'src/schemas/room-status.schema';
import { StoredImage } from 'src/utils/constants';
import { FirebaseService } from 'src/utils/firebase-service';
import {
  AccessEvent,
  AccessEventDocument,
} from '../../schemas/access-event.schema';
import {
  AccessEventDto,
  AccessEventUpdateDto,
} from './dto';

@Injectable()
export class AccessEventService {
  constructor(
    @InjectModel(AccessEvent.name)
    private eventModel: Model<AccessEventDocument>,

    @InjectModel(RoomStatus.name)
    private roomStatusModel: Model<RoomStatusDocument>,

    private firebaseService: FirebaseService,
  ) {}

  async getListAccessEvents(
    limit: string,
    page: string,
    uid: string,
    orgId: string,
    roomId: string,
    guest: boolean,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (uid)
        filters.user_id = new mongoose.Types.ObjectId(uid);
      if (orgId) filters.organization_id = orgId;
      if (roomId) filters.room_id = roomId;
      if (guest) filters.is_guest = guest;

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find access events
      const access_events = await this.eventModel
        .find(filters, null, options)
        .populate('organization', '_id name')
        .populate('room', '_id name')
        .populate('user', '_id name');

      // Calculate total access events
      const total_events = await this.eventModel.count(
        filters,
      );
      const last_page = Math.ceil(
        total_events / options.limit,
      );

      return {
        status_code: 200,
        data: access_events,
        total: total_events,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getEventById(eventId: string) {
    try {
      const event = await this.eventModel
        .findOne({
          _id: eventId,
        })
        .populate('organization', '_id name')
        .populate('room', '_id name')
        .populate('user', '_id name');
      return {
        status_code: 200,
        data: event,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createEvent(
    eventDto: AccessEventDto,
    event_images: Array<Express.Multer.File>,
  ) {
    try {
      const uploadFiles: Array<StoredImage> =
        await this.firebaseService.uploadImagesToFirebase(
          event_images,
          'access-events',
        );

      const createdEvent = await this.eventModel.create({
        ...eventDto,
        is_guest: eventDto.is_guest === 'true',
        images: uploadFiles.map(
          (item: StoredImage) => item,
        ),
      });

      const updatedRoomStatus =
        await this.roomStatusModel.updateOne(
          {
            room_id: eventDto.room_id,
          },
          {
            $inc: {
              total_visitor: 1,
              current_occupancy: 1,
            },
          },
        );

      return {
        status_code: 201,
        data: eventDto,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateEventById(
    eventId: string,
    eventDto: AccessEventUpdateDto,
  ) {
    try {
      const updatedEvent = await this.eventModel.updateOne(
        {
          _id: eventId,
        },
        eventDto,
      );
      return {
        status_code: 201,
        updated_count: updatedEvent.modifiedCount,
        data: eventDto,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteEventById(eventId: string) {
    try {
      const deletedEvent = await this.eventModel.deleteOne({
        _id: eventId,
      });
      return {
        status_code: 201,
        deleted_count: deletedEvent.deletedCount,
        data: {
          event_id: eventId,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
