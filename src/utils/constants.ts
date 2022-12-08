export const ROLES = {
  ADMIN: '638c5f71700c4c50a7ffc028',
  MANAGER: '638c5f6a700c4c50a7ffc027',
  SUBSCRIBER: '638c5f71700c4c50a7ffc028',
};

export enum CREDENTIAL_TYPE {
  APP_QR = 'app-qr',
  MAIL_QR = 'mail-qr',
  ADMIN_PERMIT = 'admin-permit',
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

export enum ROOM_TYPE {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum ROOM_STATUS {
  AVAIALBE = 'available',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable',
}

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
