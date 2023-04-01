import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ABNORMAL_EVENT_TYPE } from 'src/utils/constants';

export class AbnormalEventDto {
  @IsMongoId()
  @IsNotEmpty()
  organization_id: string;

  @IsMongoId()
  @IsNotEmpty()
  room_id: string;

  @IsMongoId()
  @IsEnum(ABNORMAL_EVENT_TYPE)
  @IsNotEmpty()
  abnormal_type_id: string;

  @IsDateString()
  @IsOptional()
  occurred_time: string;

  @IsString()
  @IsOptional()
  note: string;
}

export class AbnormalEventUpdateDto {
  @IsMongoId()
  @IsOptional()
  organization_id: string;

  @IsMongoId()
  @IsOptional()
  room_id: string;

  @IsMongoId()
  @IsEnum(ABNORMAL_EVENT_TYPE)
  @IsOptional()
  abnormal_type_id: string;

  @IsDateString()
  @IsOptional()
  occurred_time: string;

  @IsString()
  @IsOptional()
  note: string;
}
