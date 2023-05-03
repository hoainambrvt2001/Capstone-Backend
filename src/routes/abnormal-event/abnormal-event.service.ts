import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import mongoose, { Model } from 'mongoose';
import {
  AbnormalEvent,
  AbnormalEventDocument,
} from '../../schemas/abnormal-event.schema';
import {
  AbnormalEventDto,
  AbnormalEventUpdateDto,
} from './dto';
import { MqttService } from '../../services/mqtt/mqtt.service';
import { StorageService } from 'src/services/storage/storage.service';
import {
  ABNORMAL_EVENT_TYPE,
  MQTT_MESSAGE_TYPE,
  StoredImage,
} from '../../utils/constants';
import {
  Room,
  RoomDocument,
} from 'src/schemas/room.schema';

@Injectable()
export class AbnormalEventService {
  private adminMqttTopic: string;

  constructor(
    @InjectModel(AbnormalEvent.name)
    private eventModel: Model<AbnormalEventDocument>,

    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,

    private storageService: StorageService,

    private mqttService: MqttService,

    private configService: ConfigService,
  ) {
    this.adminMqttTopic = this.configService.get<string>(
      'ADAFRUIT_MQTT_ADMIN_TOPIC',
    );
  }

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
      if (roomId)
        filters.room_id = new mongoose.Types.ObjectId(
          roomId,
        );
      if (orgId)
        filters.organization_id =
          new mongoose.Types.ObjectId(orgId);
      if (typeId)
        filters.abnormal_type_id =
          new mongoose.Types.ObjectId(typeId);

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
    additional_infos: any = {},
  ) {
    try {
      // Upload image to Google Cloud Storage:
      let uploadedImages: Array<StoredImage> = [];
      for (const eventImage of event_images) {
        const uploadedImage =
          await this.storageService.save(
            'events/abnormal_events/',
            eventImage.originalname,
            eventImage.buffer,
          );
        uploadedImages.push(uploadedImage);
      }
      // Store event to MongoDB:
      const eventData = {
        ...eventDto,
        images: uploadedImages.map(
          (image: StoredImage) => image,
        ),
      };
      const createdEvent = await this.eventModel.create(
        eventData,
      );
      // Update room status:
      const updatedRoom =
        await this.roomModel.findOneAndUpdate(
          {
            room_id: eventDto.room_id,
          },
          {
            $inc: { total_abnormal_events: 1 },
          },
          {
            new: true,
          },
        );
      // Notify admin about abnormal event:
      const mqttMessage = JSON.stringify({
        type:
          eventDto.abnormal_type_id ===
          ABNORMAL_EVENT_TYPE.OVERCROWD
            ? MQTT_MESSAGE_TYPE.ABNORMAL_OVERCROWD
            : MQTT_MESSAGE_TYPE.ABNOMAL_STRANGER,
        data: {
          ...createdEvent,
          ...additional_infos,
          room_name: updatedRoom.name,
        },
      });
      await this.mqttService.publish(
        this.adminMqttTopic,
        mqttMessage,
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
