import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { STORE_STATUS } from '../../../utils/constants';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  photo_url: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsMongoId()
  @IsOptional()
  role_id: string;

  @IsArray()
  @IsOptional()
  registered_faces: string[];
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  photo_url: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsMongoId()
  @IsOptional()
  role_id: string;

  @IsArray()
  @IsOptional()
  registered_faces: string[];

  @IsEnum(STORE_STATUS)
  @IsOptional()
  status: string;
}
