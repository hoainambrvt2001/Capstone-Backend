import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { REQUEST_ACCESS_STATUS } from '../../../utils/constants';

export class RequestAccessDto {
  @IsMongoId()
  @IsNotEmpty()
  organization_id: string;

  @IsString()
  @IsNotEmpty()
  user_name: string;

  @IsArray()
  @IsNotEmpty()
  registered_face_images: [];

  @IsDateString()
  @IsNotEmpty()
  requested_time: string;

  @IsString()
  @IsOptional()
  note: string;
}

export class RequestAccessUpdateDto {
  @IsOptional()
  @IsEnum(REQUEST_ACCESS_STATUS)
  status: string;
}
