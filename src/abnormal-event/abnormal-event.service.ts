import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AbnormalEvent,
  AbnormalEventDocument,
} from 'src/schemas/abnormal-event.schema';
import {
  Room,
  RoomDocument,
} from 'src/schemas/room.schema';
import {
  AbnormalEventDto,
  AbnormalEventUpdateDto,
} from './dto';

@Injectable()
export class AbnormalEventService {
  constructor(
    @InjectModel(AbnormalEvent.name)
    private eventModel: Model<AbnormalEventDocument>,

    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async getEvents(
    limit: string,
    page: string,
    building: string,
    room: string,
    type: string,
  ) {
    try {
      // Find all filtered rooms:
      const filtersRoom: any = {};
      if (building) filtersRoom.building = building;
      if (room) filtersRoom.name = room;

      const fitered_rooms = await this.roomModel
        .find(filtersRoom)
        .select('_id');

      // Determine filters in find()
      const filters: any = {};
      if (type) filters.type = type;
      if (fitered_rooms.length)
        filters.room = { $in: fitered_rooms };

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find all filtered abnormal_events:
      const abnormal_events = await this.eventModel
        .find(filters, null, options)
        .populate('room', [
          'code',
          'name',
          'building',
          'floor',
          'type',
        ]);

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
        .populate('room', [
          'code',
          'name',
          'building',
          'floor',
          'type',
        ]);
      return {
        status_code: 200,
        data: event,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createEvent(eventDto: AbnormalEventDto) {
    try {
      const createdEvent = await this.eventModel.create(
        eventDto,
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
