import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ZipcodeDto } from './zipcode.dto';

export class ZipcodeSearchDto extends ZipcodeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 0.9375 })
  score: number;
}
