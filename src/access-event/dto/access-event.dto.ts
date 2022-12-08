import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CREDENTIAL_TYPE } from 'src/utils/constants';

export class AccessEventDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  room: string;

  @IsNotEmpty()
  @IsArray()
  images: object[];

  @IsNotEmpty()
  @IsEnum(CREDENTIAL_TYPE)
  credential: string;

  @IsOptional()
  @IsDateString()
  time: string;
}

export class AccessEventUpdateDto {
  @IsOptional()
  @IsMongoId()
  user: string;

  @IsOptional()
  @IsMongoId()
  room: string;

  @IsOptional()
  @IsArray()
  images: object[];

  @IsOptional()
  @IsEnum(CREDENTIAL_TYPE)
  credential: string;

  @IsOptional()
  @IsDateString()
  time: string;
}
