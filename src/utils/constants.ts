export const ROLE = {
  ADMIN: '638c5f1c700c4c50a7ffc01d',
  MANAGER: '638c5f6a700c4c50a7ffc027',
  SUBSCRIBER: '638c5f71700c4c50a7ffc028',
};

export enum ROOM_TYPE {
  PUBLIC = '6413ebf956917f74591468fb',
  PRIVATE = '6413ebf956917f74591468fc',
}

export enum ABNORMAL_EVENT_TYPE {
  STRANGER = 'stranger',
  OVERCROWD = 'overcrowd',
  FIRE = 'fire',
  OTHER = 'other',
}

export enum IMAGE_TYPE {
  IMAGE = 'image',
  AVATAR = 'avatar',
  ACCESS_EVENT = 'access-event',
  ABNORMAL_EVENT = 'abnormal-event',
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
