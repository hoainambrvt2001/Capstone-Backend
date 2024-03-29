import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ABNORMAL_EVENT_TYPE,
  SORT_BY,
  StoredImage,
} from '../../utils/constants';
import {
  AccessEventDto,
  AccessEventUpdateDto,
} from './dto';
import {
  Room,
  RoomDocument,
} from 'src/schemas/room.schema';
import {
  AccessEvent,
  AccessEventDocument,
} from '../../schemas/access-event.schema';
import { StorageService } from 'src/services/storage/storage.service';
import { AbnormalEventService } from '../abnormal-event/abnormal-event.service';
import { AbnormalEventDto } from '../abnormal-event/dto';

@Injectable()
export class AccessEventService {
  constructor(
    @InjectModel(AccessEvent.name)
    private eventModel: Model<AccessEventDocument>,

    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,

    private storageService: StorageService,

    private abnormalEventService: AbnormalEventService,
  ) {}

  async getListAccessEvents(
    limit: string,
    page: string,
    uid: string,
    orgId: string,
    roomId: string,
    guest: boolean,
    sort: string,
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
      const limit_option = limit ? parseInt(limit) : 9;
      const page_option = page ? parseInt(page) - 1 : 0;
      const options: any = {
        limit: limit_option,
        skip: page_option * limit_option,
      };

      const sortOptions: any = {
        accessed_time: -1,
      };
      if (sort) {
        if (sort === SORT_BY.TIME_ACS)
          sortOptions.accessed_time = 1;
        if (sort === SORT_BY.TIME_DESC)
          sortOptions.accessed_time = -1;
      }

      // Find access events
      const access_events = await this.eventModel
        .find(filters, null, options)
        .sort(sortOptions)
        .populate('organization', '_id name')
        .populate('room', '_id name')
        .populate(
          'user',
          '_id name email phone_number photo_url',
        );

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

  async getEventByUserId(userId: string) {
    try {
      const event = await this.eventModel
        .find(
          {
            user_id: userId,
          },
          null,
          { limit: 10 },
        )
        .sort({ accessed_time: -1 })
        .populate('organization', '_id name')
        .populate('room', '_id name')
        .select('-__v -createdAt -updatedAt -is_guest');
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
      let uploadedImages: Array<StoredImage> = [];
      for (const eventImage of event_images) {
        const uploadedImage =
          await this.storageService.save(
            'events/access_events/',
            eventImage.originalname,
            eventImage.buffer,
          );
        uploadedImages.push(uploadedImage);
      }

      const createdEvent = await this.eventModel.create({
        ...eventDto,
        is_guest: eventDto.is_guest === 'true',
        images: uploadedImages.map(
          (image: StoredImage) => image,
        ),
      });

      const updatedRoom =
        await this.roomModel.findOneAndUpdate(
          {
            room_id: eventDto.room_id,
          },
          {
            $inc: {
              total_visitors: 1,
              current_occupancy: 1,
            },
          },
          {
            new: true,
          },
        );

      if (
        updatedRoom.current_occupancy >=
        updatedRoom.max_occupancy
      ) {
        const abnormalEventData: AbnormalEventDto = {
          abnormal_type_id: ABNORMAL_EVENT_TYPE.OVERCROWD,
          occurred_time: new Date().toISOString(),
          organization_id: eventDto.organization_id,
          room_id: eventDto.room_id,
          note: '',
        };
        const additonalInfos = {
          room_name: updatedRoom.name,
          current_occupancy: updatedRoom.current_occupancy,
          max_occupancy: updatedRoom.max_occupancy,
        };
        this.abnormalEventService.createEvent(
          abnormalEventData,
          [],
          additonalInfos,
        );
      }

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

  async updateCheckoutEvent(room_id: string) {
    try {
      const updatedRoom = await this.roomModel.updateOne(
        {
          room_id: room_id,
        },
        {
          $inc: {
            current_occupancy: -1,
          },
        },
      );
      return {
        status_code: 201,
        updated_count: updatedRoom.modifiedCount,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
