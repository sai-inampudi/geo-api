import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class ZipcodeDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(5, 5)
  @ApiProperty({ example: '66062' })
  zipcode: string;

  @IsString()
  @ApiProperty({ example: 'Olathe' })
  city: string;

  @IsString()
  @ApiProperty({ example: 'Kansas' })
  state: string;

  @IsString()
  @ApiProperty({ example: 'KS' })
  stateAbbreviation: string;

  @IsString()
  @ApiProperty({ example: 'Johnson' })
  county: string;

  @IsNumber()
  @ApiProperty({ example: 38.8733 })
  latitude: number;

  @IsNumber()
  @ApiProperty({ example: -94.7752 })
  longitude: number;
}
