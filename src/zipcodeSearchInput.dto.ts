import { IsNotEmpty, IsString } from 'class-validator';

export class ZipcodeSearchInputDto {
  @IsNotEmpty()
  @IsString()
  city: string;
}
