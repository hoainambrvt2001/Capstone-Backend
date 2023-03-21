import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class AccessEventDto {
  @IsMongoId()
  @IsNotEmpty()
  organization_id: string;

  @IsMongoId()
  @IsNotEmpty()
  room_id: string;

  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsBoolean()
  @IsNotEmpty()
  is_guest: string;

  @IsDateString()
  @IsNotEmpty()
  accessed_time: string;
}

export class AccessEventUpdateDto {
  @IsMongoId()
  @IsOptional()
  organization_id: string;

  @IsMongoId()
  @IsOptional()
  room_id: string;

  @IsMongoId()
  @IsOptional()
  user_id: string;

  @IsArray()
  @IsOptional()
  images: string[];

  @IsBoolean()
  @IsOptional()
  is_guest: string;

  @IsDateString()
  @IsOptional()
  accessed_time: string;
}
