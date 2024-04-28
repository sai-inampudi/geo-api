import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import * as fs from 'fs';
import { ZipcodeDto } from './zipcode.dto';
import { ZipcodeSearchDto } from './zipcodeSearch.dto';
var similarity = require('similarity');

@Injectable()
/**
 * Service class for managing zipcodes.
 */
export class ZipcodeService implements OnModuleInit {
  private zipcodesById: Record<string, ZipcodeDto>;
  private zipcodesByCity: Record<string, ZipcodeDto[]>;
  private logger: Logger; // Add the logger property

  constructor() {
    this.logger = new Logger(ZipcodeService.name);
  }

  /**
   * This method is automatically called when the module is initialized. It also
   * will only be called once so it is a good place to load data that will be
   * used throughout the lifecycle of the application like our zip code data.
   */
  onModuleInit() {
    this.loadZipsData();
  }

  /**
   * Loads the zip code data from a CSV file and stores it into two maps:
   *   * The first map uses the zip code as the key and the corresponding ZipcodeDto as the value.
   *       * Storing the zip code data in a map allows for efficient lookup and retrieval of
   *         zip code information based on the zip code itself using constant time complexity
   *   * The second map uses the city name as the key and an array of ZipcodeDto as the value.
   *       * Storing the city data in a map allows for efficient retrieval of all zip codes
   *         associated with a city using constant time complexity.
   *
   * @private
   */
  private loadZipsData() {
    const startTime = new Date().getTime(); // Get the start time

    // Not using any particular csv parsing library for simplicity and because
    // our csv data is simple enough to parse manually.
    const csvData = fs.readFileSync('./resources/zips.csv', 'utf-8');
    const rows = csvData.split('\n');
    const zipcodes: Record<string, ZipcodeDto> = {};

    const zipcodesByCity: Record<string, ZipcodeDto[]> = {};

    rows.forEach((row) => {
      const columns = row.split(',');
      const input: ZipcodeDto = {
        zipcode: columns[0],
        city: columns[1],
        state: columns[2],
        stateAbbreviation: columns[3],
        county: columns[4],
        latitude: parseFloat(columns[5]),
        longitude: parseFloat(columns[6]),
      };

      if (!zipcodesByCity[input.city]) {
        zipcodesByCity[input.city] = [];
      }
      zipcodesByCity[input.city].push(input);

      zipcodes[input.zipcode] = input;
    });

    this.zipcodesById = zipcodes;
    this.zipcodesByCity = zipcodesByCity;

    const endTime = new Date().getTime(); // Get the end time
    const executionTime = `${endTime - startTime}ms`; // Calculate the execution time

    this.logger.log({ executionTime }, 'Zip data loaded');
  }

  /**
   * Retrieves the details of a zipcode based on the provided id.
   * @param id - The id of the zipcode to retrieve.
   * @returns The details of the zipcode.
   * @throws NotFoundException if the zipcode is not found.
   */
  getZipcode(id: string): ZipcodeDto {
    this.logger.log({ zipcode: id }, `Getting zipcode details for ${id}`);
    const zipcode = this.zipcodesById[id];
    if (!zipcode) {
      throw new NotFoundException('Zipcode not found');
    }
    return zipcode;
  }

  /**
   * Retrieves the top 3 matching zipcodes based on the input city.
   *
   * @param inputCity - The city for which to find matching zipcodes.
   * @returns An array of ZipcodeSearchDto objects representing the top 3 matching zipcodes.
   */
  getByTop3MatchingCities(inputCity: string): ZipcodeSearchDto[] {
    const citiesWithSimilarityScores = Object.keys(this.zipcodesByCity).map(
      (city) => {
        // We don't have to worry about case sensitivity because the similarity function is case-insensitive.
        // similarity uses the Leavenstein distance algorithm to calculate the similarity between two strings.
        // https://stackoverflow.com/questions/15303631/what-are-some-algorithms-for-comparing-how-similar-two-strings-are
        const score = similarity(city, inputCity);
        return { city, score };
      },
    );

    const top3Cities = citiesWithSimilarityScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const result = [];
    top3Cities.forEach(({ city, score }) => {
      const zipcodesWithScore = this.zipcodesByCity[city].map((zipcode) => ({
        ...zipcode,
        score,
      }));
      result.push(...zipcodesWithScore);
    });

    return result;
  }
}
