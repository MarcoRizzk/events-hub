import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRsvpDto {
  @IsNotEmpty()
  @IsInt()
  eventId: number;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail: string;
}
