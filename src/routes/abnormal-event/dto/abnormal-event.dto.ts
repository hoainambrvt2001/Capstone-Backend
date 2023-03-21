import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AbnormalEventDto {
  @IsMongoId()
  @IsNotEmpty()
  organization_id: string;

  @IsMongoId()
  @IsNotEmpty()
  room_id: string;

  @IsMongoId()
  @IsNotEmpty()
  abnormal_type_id: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];

  @IsDateString()
  @IsNotEmpty()
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
  @IsOptional()
  abnormal_type_id: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsDateString()
  @IsOptional()
  occurred_time: string;

  @IsString()
  @IsOptional()
  note: string;
}
