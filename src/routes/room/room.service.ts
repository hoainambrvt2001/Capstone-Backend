import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Room,
  RoomDocument,
} from 'src/schemas/room.schema';
import { RoomDto, RoomUpdateDto } from './dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async search(
    queryString: string,
    page: string,
    limit: string,
  ) {
    try {
      // Change query string to regExp:
      const reg = new RegExp(queryString, 'i');
      const filters = { name: reg };

      // Determine options in find():
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find rooms:
      const rooms = await this.roomModel
        .find(filters, null, options)
        .select('_id name');

      // Calculate total number of rooms:
      const totalRooms = await this.roomModel.count(
        filters,
      );
      const last_page = Math.ceil(
        totalRooms / options.limit,
      );

      return {
        status: 200,
        data: rooms,
        total: totalRooms,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getListRooms(
    limit: string,
    page: string,
    type_id: string,
    status: string,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (type_id) filters.room_type_id = type_id;
      if (status) filters.status = status;

      // Determine options in find()
      const options: any = {
        limit: limit ? parseInt(limit) : 9,
        skip: page ? parseInt(page) - 1 : 0,
      };

      // Find rooms
      const rooms = await this.roomModel.find(
        filters,
        null,
        options,
      );

      // Calculate total rooms
      const total_rooms = await this.roomModel.count(
        filters,
      );
      const last_page = Math.ceil(
        total_rooms / options.limit,
      );

      return {
        status_code: 200,
        data: rooms,
        total: total_rooms,
        page: options.skip + 1,
        last_page: last_page ? last_page : 1,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getRoomById(roomId: string) {
    try {
      const room = await this.roomModel
        .findOne({
          _id: roomId,
        })
        .populate('room_type', '_id name')
        .populate('organization', '_id name');
      return {
        status_code: 200,
        data: room,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createRoom(roomDto: RoomDto) {
    try {
      const createdRoom = await this.roomModel.create(
        roomDto,
      );
      return {
        status_code: 201,
        data: createdRoom,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updateRoomById(
    roomId: string,
    roomDto: RoomUpdateDto,
  ) {
    try {
      const updatedRoom = await this.roomModel.updateOne(
        {
          _id: roomId,
        },
        roomDto,
      );
      return {
        status_code: 201,
        updated_count: updatedRoom.modifiedCount,
        data: roomDto,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteRoomById(roomId: string) {
    try {
      const deletedRoom = await this.roomModel.deleteOne({
        _id: roomId,
      });
      return {
        status_code: 201,
        deleted_count: deletedRoom.deletedCount,
        data: {
          room_id: roomId,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
