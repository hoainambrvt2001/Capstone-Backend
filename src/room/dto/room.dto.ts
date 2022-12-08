import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ROOM_STATUS,
  ROOM_TYPE,
} from 'src/utils/constants';

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  building: string;

  @IsNotEmpty()
  @IsNumber()
  floor: number;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsEnum(ROOM_TYPE)
  type: string;

  @IsOptional()
  @IsEnum(ROOM_STATUS)
  status: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class RoomUpdateDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  building: string;

  @IsOptional()
  @IsNumber()
  floor: number;

  @IsOptional()
  @IsNumber()
  capacity: number;

  @IsOptional()
  @IsEnum(ROOM_TYPE)
  type: string;

  @IsOptional()
  @IsEnum(ROOM_STATUS)
  status: string;

  @IsOptional()
  @IsString()
  description: string;
}
