import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+/, { message: 'phone must start with a +' })
  phoneNumber?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
