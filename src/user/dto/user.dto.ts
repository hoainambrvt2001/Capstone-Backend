import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  // IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GENDER, STORE_STATUS } from 'src/utils/constants';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsObject()
  avatar: {
    name: string;
    url: string;
  };

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender: string;

  @IsOptional()
  @IsDateString()
  birthdate: Date;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsMongoId()
  role: string;

  @IsOptional()
  @IsEnum(STORE_STATUS)
  status: string;
}

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsObject()
  avatar: {
    name: string;
    url: string;
  };

  @IsOptional()
  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender: string;

  @IsOptional()
  @IsDateString()
  birthdate: Date;

  @IsOptional()
  @IsString()
  province: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  ward: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsMongoId()
  role: string;

  @IsOptional()
  @IsEnum(STORE_STATUS)
  status: string;
}
