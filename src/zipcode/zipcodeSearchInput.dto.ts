import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ZipcodeSearchInputDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Olathe' })
  city: string;
}
