import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Room,
  RoomDocument,
} from 'src/schemas/room.schema';
import { ROOM_STATUS } from 'src/utils/constants';
import { RoomDto, RoomUpdateDto } from './dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async getRooms(
    limit: string,
    page: string,
    type: string,
    building: string,
    status: string,
  ) {
    try {
      // Determine filters in find()
      const filters: any = {};
      if (type) filters.type = type;
      if (building) filters.building = building;
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

  async getBuildings() {
    try {
      const rooms = await this.roomModel.find({});
      const buildings = new Set();
      rooms.forEach((room) => {
        buildings.add(room.building);
      });
      return {
        status_code: 200,
        data: Array.from(buildings),
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getRoomById(roomId: string) {
    try {
      const room = await this.roomModel.findOne({
        _id: roomId,
      });
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
      const deletedRoom = await this.roomModel.updateOne(
        {
          _id: roomId,
        },
        {
          status: ROOM_STATUS.UNAVAILABLE,
        },
      );
      return {
        status_code: 201,
        deleted_count: deletedRoom.modifiedCount,
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
