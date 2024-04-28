import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ZipcodeDto } from './zipcode.dto';
import { ZipcodePipe } from './zipcode.pipe';
import { ZipcodeService } from './zipcode.service';
import { ZipcodeSearchDto } from './zipcodeSearch.dto';

@Controller()
export class AppController {
  constructor(private readonly zipcodeService: ZipcodeService) {}

  @Get('/zipcodes/:zipcode')
  async getZipcode(
    @Param('zipcode', new ZipcodePipe()) id,
    @Res() res,
  ): Promise<ZipcodeDto> {
    return res.json(await this.zipcodeService.getZipcode(id));
  }

  @Post('/zipcodes')
  async getTop3MatchingCities(
    @Body() body: { city: string },
    @Res() res,
  ): Promise<ZipcodeSearchDto[]> {
    const { city } = body;
    return res.json(await this.zipcodeService.getByTop3MatchingCities(city));
  }
}
