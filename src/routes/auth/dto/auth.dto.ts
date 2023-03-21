import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  photo_url: string;
}

export class SocialAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsString()
  @IsOptional()
  photo_url: string;
}
