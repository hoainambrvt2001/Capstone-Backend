import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ABNORMAL_EVENT_TYPE } from 'src/utils/constants';

export class AbnormalEventDto {
  @IsNotEmpty()
  @IsMongoId()
  room: string;

  @IsNotEmpty()
  @IsEnum(ABNORMAL_EVENT_TYPE)
  type: string;

  @IsNotEmpty()
  @IsArray()
  images: object[];

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsDateString()
  time: string;

  @IsOptional()
  @IsBoolean()
  is_checked: boolean;
}

export class AbnormalEventUpdateDto {
  @IsOptional()
  @IsMongoId()
  room: string;

  @IsOptional()
  @IsEnum(ABNORMAL_EVENT_TYPE)
  type: string;

  @IsOptional()
  @IsArray()
  images: object[];

  @IsOptional()
  @IsString()
  note: string;

  @IsOptional()
  @IsDateString()
  time: string;

  @IsOptional()
  @IsBoolean()
  is_checked: boolean;
}
