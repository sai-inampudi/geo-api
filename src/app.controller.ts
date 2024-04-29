import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam } from '@nestjs/swagger';
import { ZipcodeDto } from './zipcode/zipcode.dto';
import { ZipcodePipe } from './zipcode/zipcode.pipe';
import { ZipcodeService } from './zipcode/zipcode.service';
import { ZipcodeSearchDto } from './zipcode/zipcodeSearch.dto';
import { ZipcodeSearchInputDto } from './zipcode/zipcodeSearchInput.dto';

@Controller()
export class AppController {
  private logger: Logger;

  constructor(private readonly zipcodeService: ZipcodeService) {
    this.logger = new Logger(ZipcodeService.name);
  }

  @Get('/zipcodes/:zipcode')
  @ApiParam({
    name: 'zipcode',
    required: true,
    description: 'A 5-digit US zipcode',
    schema: { type: 'string' },
  })
  @UseGuards(AuthGuard('bearer'))
  async getZipcode(
    @Param('zipcode', new ZipcodePipe()) id,
    @Req() req,
    @Res() res,
  ): Promise<ZipcodeDto> {
    const {
      claims: { sub: emailAddress },
    } = req.user;

    this.logger.log(
      { zipcode: id, emailAddress },
      `Begin getting zipcode details for ${id}`,
    );

    const zipcode = await this.zipcodeService.getZipcode(id);

    this.logger.log(
      { zipcode: id, emailAddress },
      `Finish getting zipcode details for ${id}`,
    );

    return res.json(zipcode);
  }

  @Post('/zipcodes/citysearch')
  @UseGuards(AuthGuard('bearer'))
  @HttpCode(200)
  async getTop3MatchingZipcodes(
    @Body(new ValidationPipe({ transform: true })) body: ZipcodeSearchInputDto,
    @Req() req,
    @Res() res,
  ): Promise<ZipcodeSearchDto[]> {
    const { city } = body;
    const {
      claims: { sub: emailAddress },
    } = req.user;

    this.logger.log(
      { city, emailAddress },
      `Begin searching for zipcodes related to city: ${city}`,
    );

    const zipcodeMatches =
      await this.zipcodeService.getTop3MatchingZipcodes(city);

    this.logger.log(
      { city, emailAddress },
      `Finish searching for zipcodes related to city: ${city}, found ${zipcodeMatches.length} matches`,
    );

    return res.json(zipcodeMatches);
  }
}
