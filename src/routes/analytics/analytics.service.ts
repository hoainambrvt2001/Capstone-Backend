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
  startOfDay,
  startOfWeek,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import mongoose, { Model } from 'mongoose';
import {
  AbnormalEvent,
  AbnormalEventDocument,
} from '../../schemas/abnormal-event.schema';
import {
  AccessEvent,
  AccessEventDocument,
} from '../../schemas/access-event.schema';
import {
  ABNORMAL_EVENT_REPORT_MODE,
  ABNORMAL_EVENT_TYPE,
  DAY_OF_WEEK,
} from '../../utils/constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(AbnormalEvent.name)
    private abnormalEventModel: Model<AbnormalEventDocument>,

    @InjectModel(AccessEvent.name)
    private accessEventModel: Model<AccessEventDocument>,
  ) {}

  async getAllReports(roomId: string) {
    try {
      const { data: vistorsByDayReport } =
        await this.getVisitorsByDayReport(roomId);
      const { data: abnormalEventsReport } =
        await this.getAbnormalEventsReport(
          roomId,
          ABNORMAL_EVENT_REPORT_MODE.MONTH,
        );
      return {
        status_code: 200,
        data: {
          vistors_by_days_report: vistorsByDayReport,
          abnormal_event_report: abnormalEventsReport,
        },
      };
    } catch (e) {
      throw e;
    }
  }

  async getVisitorsByDayReport(roomId: string) {
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
      let vistorsByDays = {};
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
          vistorsByDays[
            DAY_OF_WEEK[i + 1 <= 6 ? i + 1 : '0']
          ] = numberOfVisitor;
          currentDate = addDays(currentDate, 1);
        } else {
          vistorsByDays[
            DAY_OF_WEEK[i + 1 <= 6 ? i + 1 : '0']
          ] = 0;
        }
      }
      return {
        status_code: 200,
        data: vistorsByDays,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAbnormalEventsReport(
    roomId: string,
    mode: string,
  ) {
    try {
      const currDate = new Date();
      let intervals: Date[];
      let callback: (param: Date) => string;
      if (mode == ABNORMAL_EVENT_REPORT_MODE.TODAY) {
        intervals = eachHourOfInterval({
          start: startOfDay(currDate),
          end: currDate,
        });
        callback = (param: Date) => format(param, 'HH:mm');
      } else if (
        mode == ABNORMAL_EVENT_REPORT_MODE.HALF_MONTH
      ) {
        intervals = eachDayOfInterval(
          {
            start: subDays(currDate, 15),
            end: currDate,
          },
          { step: 1 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == ABNORMAL_EVENT_REPORT_MODE.MONTH) {
        intervals = eachDayOfInterval(
          {
            start: subMonths(currDate, 1),
            end: currDate,
          },
          { step: 2 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (
        mode == ABNORMAL_EVENT_REPORT_MODE.HALF_YEAR
      ) {
        intervals = eachWeekOfInterval(
          {
            start: subMonths(currDate, 6),
            end: currDate,
          },
          { weekStartsOn: 1 },
        );
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (mode == ABNORMAL_EVENT_REPORT_MODE.YEAR) {
        intervals = eachMonthOfInterval({
          start: subYears(currDate, 1),
          end: currDate,
        });
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      } else if (
        mode == ABNORMAL_EVENT_REPORT_MODE.FIVE_YEARS
      ) {
        intervals = eachQuarterOfInterval({
          start: subYears(currDate, 5),
          end: currDate,
        });
        intervals.push(currDate);
        callback = (param: Date) => format(param, 'dd/MM');
      }
      return {
        status_code: 200,
        data: await this.getCountEventsEachIntervals(
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

  async getCountEventsEachIntervals(
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
