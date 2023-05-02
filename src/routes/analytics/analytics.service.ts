import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  format,
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  endOfDay,
  getHours,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import mongoose, { Model, Mongoose } from 'mongoose';
import {
  AbnormalEvent,
  AbnormalEventDocument,
} from '../../schemas/abnormal-event.schema';
import {
  AccessEvent,
  AccessEventDocument,
} from '../../schemas/access-event.schema';
import {
  RoomStatus,
  RoomStatusDocument,
} from '../../schemas/room-status.schema';
import {
  ABNORMAL_EVENT_TYPE,
  DAY_OF_WEEK,
} from '../../utils/constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(RoomStatus.name)
    private roomStatusModel: Model<RoomStatusDocument>,

    @InjectModel(AbnormalEvent.name)
    private abnormalEventModel: Model<AbnormalEventDocument>,

    @InjectModel(AccessEvent.name)
    private accessEventModel: Model<AccessEventDocument>,
  ) {}

  async getRoomStatus(roomId: string) {
    try {
      const roomStatus = await this.roomStatusModel
        .findOne({
          room_id: roomId,
        })
        .populate('room', '_id name max_occupancy');

      return {
        status_code: 200,
        data: roomStatus,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getVisitorsByDay(roomId: string) {
    try {
      // 0: Sunday, 1: Monday, ... 6: Saturday.
      const endToDate = new Date();
      const startFromDate = startOfWeek(endToDate, {
        weekStartsOn: 1,
      });
      const rangeDate = differenceInCalendarDays(
        endToDate,
        startFromDate,
      );
      let returnData = {};
      let currentDate = startFromDate;
      for (let i = 0; i < 7; i++) {
        if (i <= rangeDate) {
          const numberOfVisitor =
            await this.accessEventModel.countDocuments({
              room_id: roomId,
              accessed_time: {
                $gt: currentDate,
                $lt:
                  i == rangeDate
                    ? endToDate
                    : endOfDay(currentDate),
              },
            });
          returnData[
            DAY_OF_WEEK[i + 1 <= 6 ? i + 1 : '0']
          ] = numberOfVisitor;
          currentDate = addDays(currentDate, 1);
        } else {
          returnData[
            DAY_OF_WEEK[i + 1 <= 6 ? i + 1 : '0']
          ] = 0;
        }
      }
      return {
        status_code: 200,
        data: {
          visitors_by_day: returnData,
        },
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAbnormalEvents(roomId: string, mode: string) {
    try {
      const currDate = new Date();
      let intervals: Date[];
      let callback: (param: Date) => string;
      if (mode == '1d') {
        intervals = eachHourOfInterval({
          start: startOfDay(currDate),
          end: currDate,
        });
        callback = (param: Date) => format(param, 'HH:mm');
      } else if (mode == '15ds') {
        intervals = eachDayOfInterval(
          {
            start: subDays(currDate, 15),
            end: currDate,
          },
          { step: 1 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == '1m') {
        intervals = eachDayOfInterval(
          {
            start: subMonths(currDate, 1),
            end: currDate,
          },
          { step: 2 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == '6ms') {
        intervals = eachWeekOfInterval(
          {
            start: subMonths(currDate, 6),
            end: currDate,
          },
          { weekStartsOn: 1 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == '1y') {
        intervals = eachMonthOfInterval({
          start: subYears(currDate, 1),
          end: currDate,
        });
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == '5ys') {
        intervals = eachQuarterOfInterval({
          start: subYears(currDate, 5),
          end: currDate,
        });
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      }
      return {
        status_code: 200,
        data: await this.countEventsEachIntervals(
          roomId,
          intervals,
          callback,
        ),
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async countEventsEachIntervals(
    roomId: string,
    intervals: Date[],
    callback: (param: Date) => string,
  ) {
    let returnData = [];
    for (let i = 0; i < intervals.length - 1; i++) {
      returnData.push({
        name: callback(intervals[i]),
        stranger: 0,
        overcrowd: 0,
        fire: 0,
        other: 0,
        start: intervals[i],
        end: intervals[i + 1],
      });
      let countEvents =
        await this.abnormalEventModel.aggregate([
          {
            $match: {
              room_id: new mongoose.Types.ObjectId(roomId),
              occurred_time: {
                $gt: intervals[i],
                $lt: intervals[i + 1],
              },
            },
          },
          {
            $group: {
              _id: '$abnormal_type_id',
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

      for (let countEvent of countEvents) {
        if (
          countEvent._id == ABNORMAL_EVENT_TYPE.STRANGER
        ) {
          returnData[returnData.length - 1].stranger =
            countEvent.count;
        } else if (
          countEvent._id == ABNORMAL_EVENT_TYPE.OVERCROWD
        ) {
          returnData[returnData.length - 1].overcrowd =
            countEvent.count;
        } else if (
          countEvent._id == ABNORMAL_EVENT_TYPE.FIRE
        ) {
          returnData[returnData.length - 1].fire =
            countEvent.count;
        } else if (
          countEvent._id == ABNORMAL_EVENT_TYPE.OTHER
        ) {
          returnData[returnData.length - 1].other =
            countEvent.count;
        }
      }
    }
    return returnData;
  }
}
