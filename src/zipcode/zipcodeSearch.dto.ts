import { IsNotEmpty, IsNumber } from 'class-validator';
import { ZipcodeDto } from './zipcode.dto';

export class ZipcodeSearchDto extends ZipcodeDto {
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
