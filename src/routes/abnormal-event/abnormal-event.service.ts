import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AbnormalEvent,
  AbnormalEventDocument,
} from '../../schemas/abnormal-event.schema';
import {
  AbnormalEventDto,
  AbnormalEventUpdateDto,
} from './dto';
import { FirebaseService } from 'src/utils/firebase-service';
import {
  RoomStatus,
  RoomStatusDocument,
} from 'src/schemas/room-status.schema';
import { StoredImage } from 'src/utils/constants';

@Injectable()
export class AbnormalEventService {
  constructor(
    @InjectModel(AbnormalEvent.name)
    private eventModel: Model<AbnormalEventDocument>,

    @InjectModel(RoomStatus.name)
    private roomStatusModel: Model<RoomStatusDocument>,

    private firebaseService: FirebaseService,
  ) {}

  async getEvents(
    limit: string,
    page: string,
    orgId: string,
    roomId: string,
    typeId: string,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (roomId) filters.room_id = roomId;
      if (orgId) filters.organization_id = orgId;
      if (typeId) filters.abnormal_event_id = typeId;

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find all filtered abnormal_events:
      const abnormal_events = await this.eventModel
        .find(filters, null, options)
        .populate('organization', '_id name')
        .populate('room', '_id name')
        .populate('abnormal_type', 'name')
        .select('-__v');

      // Calculate the last page number:
      const total_events = await this.eventModel.count(
        filters,
      );
      const last_page = Math.ceil(
        total_events / options.limit,
      );

      return {
        status_code: 200,
        data: abnormal_events,
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
        .populate('abnormal_type', 'name');

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
    eventDto: AbnormalEventDto,
    event_images: Array<Express.Multer.File>,
  ) {
    try {
      const uploadFiles: Array<StoredImage> =
        await this.firebaseService.uploadImagesToFirebase(
          event_images,
          'abnormal-events',
        );

      const eventData = {
        ...eventDto,
        images: uploadFiles.map(
          (item: StoredImage) => item,
        ),
      };
      const createdEvent = await this.eventModel.create(
        eventData,
      );
      const updatedRoomStatus =
        await this.roomStatusModel.updateOne(
          {
            room_id: eventDto.room_id,
          },
          {
            $inc: { total_abnormal_events: 1 },
          },
        );
      return {
        status_code: 201,
        data: createdEvent,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateEventById(
    eventId: string,
    eventDto: AbnormalEventUpdateDto,
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
