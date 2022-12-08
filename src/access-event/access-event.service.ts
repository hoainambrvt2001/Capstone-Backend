import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccessEvent,
  AccessEventDocument,
} from '../../src/schemas/access-event.schema';
import {
  AccessEventDto,
  AccessEventUpdateDto,
} from './dto';

@Injectable()
export class AccessEventService {
  constructor(
    @InjectModel(AccessEvent.name)
    private eventModel: Model<AccessEventDocument>,
  ) {}

  async getEvents(
    limit: string,
    page: string,
    userId: string,
    credential: string,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (userId) filters.user = userId;
      if (credential) filters.credential = credential;

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find access events
      const access_events = await this.eventModel
        .find(filters, null, options)
        .populate('room', [
          'code',
          'name',
          'building',
          'floor',
          'type',
        ])
        .populate('user', [
          'first_name',
          'last_name',
          'avatar',
          'email',
        ]);

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
        .populate('room', [
          'code',
          'name',
          'building',
          'floor',
          'type',
        ])
        .populate('user', [
          'first_name',
          'last_name',
          'avatar',
          'email',
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

  async createEvent(eventDto: AccessEventDto) {
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
