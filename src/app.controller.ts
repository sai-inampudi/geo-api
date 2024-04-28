import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ZipcodeDto } from './zipcode/zipcode.dto';
import { ZipcodePipe } from './zipcode/zipcode.pipe';
import { ZipcodeService } from './zipcode/zipcode.service';
import { ZipcodeSearchDto } from './zipcode/zipcodeSearch.dto';
import { ZipcodeSearchInputDto } from './zipcode/zipcodeSearchInput.dto';

@Controller()
export class AppController {
  constructor(private readonly zipcodeService: ZipcodeService) {}

  @Get('/zipcodes/:zipcode')
  @UseGuards(AuthGuard('bearer'))
  async getZipcode(
    @Param('zipcode', new ZipcodePipe()) id,
    @Res() res,
  ): Promise<ZipcodeDto> {
    return res.json(await this.zipcodeService.getZipcode(id));
  }

  @Post('/zipcodes/citysearch')
  @UseGuards(AuthGuard('bearer'))
  async getTop3MatchingZipcodes(
    @Body(new ValidationPipe({ transform: true })) body: ZipcodeSearchInputDto,
    @Res() res,
  ): Promise<ZipcodeSearchDto[]> {
    const { city } = body;
    const zipcodeMatches =
      await this.zipcodeService.getTop3MatchingZipcodes(city);
    return res.json(zipcodeMatches);
  }
}
