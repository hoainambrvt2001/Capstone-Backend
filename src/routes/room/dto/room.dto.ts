import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ROOM_STATUS,
  ROOM_TYPE,
} from '../../../utils/constants';

export class RoomDto {
  @IsMongoId()
  @IsNotEmpty()
  organization_id: string;

  @IsMongoId()
  @IsEnum(ROOM_TYPE)
  @IsNotEmpty()
  room_type_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  max_occupancy: number;

  @IsString()
  @IsOptional()
  description: string;
}

export class RoomUpdateDto {
  @IsString()
  @IsEnum(ROOM_TYPE)
  @IsOptional()
  room_type_id: string;

  @IsString()
  @IsOptional()
  max_occupancy: string;

  @IsEnum(ROOM_STATUS)
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  description: string;
}
