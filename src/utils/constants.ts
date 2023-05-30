export enum ROLE {
  ADMIN = '638c5f1c700c4c50a7ffc01d',
  MANAGER = '638c5f6a700c4c50a7ffc027',
  SUBSCRIBER = '638c5f71700c4c50a7ffc028',
}

export enum ROOM_TYPE {
  PUBLIC = '6413ebf956917f74591468fb',
  PRIVATE = '6413ebf956917f74591468fc',
}

export enum ABNORMAL_EVENT_TYPE {
  STRANGER = '64191579e00817dbbf4c6501',
  OVERCROWD = '64191579e00817dbbf4c6502',
  FIRE = '64191579e00817dbbf4c6503',
  OTHER = '64191579e00817dbbf4c6504',
}

export enum STORE_STATUS {
  AVAIALBE = 'available',
  UNAVAILABLE = 'unavailable',
}

export enum ROOM_STATUS {
  AVAIALBE = 'available',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

export enum REQUEST_ACCESS_STATUS {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  CANCELED = 'canceled',
}

export enum MQTT_MESSAGE_TYPE {
  ABNORMAL_OVERCROWD = 'ABNORMAL_EVENT_OVERCROWD',
  ABNOMAL_STRANGER = 'ABNORMAL_EVENT_STRANGER',
}

export enum ABNORMAL_EVENT_REPORT_MODE {
  TODAY = '1d',
  HALF_MONTH = '15ds',
  MONTH = '1m',
  HALF_YEAR = '6ms',
  YEAR = '1y',
  FIVE_YEARS = '5yrs',
}

export enum SORT_BY {
  TIME_ACS = 'time-asc',
  TIME_DESC = 'time-desc',
}

export const DAY_OF_WEEK = {
  '0': 'Su',
  '1': 'Mo',
  '2': 'Tu',
  '3': 'We',
  '4': 'Th',
  '5': 'Fr',
  '6': 'Sa',
};

export interface StoredImage {
  name: string;
  url: string;
}
