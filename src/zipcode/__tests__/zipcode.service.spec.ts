import { NotFoundException } from '@nestjs/common';
import { ZipcodeDto } from '../zipcode.dto';
import { ZipcodeService } from '../zipcode.service';
import { ZipcodeSearchDto } from '../zipcodeSearch.dto';

describe('ZipcodeService', () => {
  let zipcodeService: ZipcodeService;

  beforeEach(() => {
    zipcodeService = new ZipcodeService();
  });

  describe('getZipcode', () => {
    it('should return the details of a valid zipcode', () => {
      const zipcodeId = '12345';
      const expectedZipcode: ZipcodeDto = {
        zipcode: '12345',
        city: 'Test City',
        state: 'Test State',
        stateAbbreviation: 'TS',
        county: 'Test County',
        latitude: 0,
        longitude: 0,
      };
      zipcodeService['zipcodesById'] = {
        [zipcodeId]: expectedZipcode,
      };

      const result = zipcodeService.getZipcode(zipcodeId);

      expect(result).toEqual(expectedZipcode);
    });

    it('should throw NotFoundException for an invalid zipcode', () => {
      const invalidZipcodeId = '99999';
      zipcodeService['zipcodesById'] = {};

      expect(() => {
        zipcodeService.getZipcode(invalidZipcodeId);
      }).toThrowError(NotFoundException);
    });
  });

  describe('getTop3MatchingZipcodes', () => {
    beforeEach(() => {
      zipcodeService['zipcodesByCity'] = {
        'Test City 1': [
          {
            zipcode: '11111',
            city: 'Test City 1',
            state: 'Test State 1',
            stateAbbreviation: 'TS1',
            county: 'Test County 1',
            latitude: 0,
            longitude: 0,
          },
        ],
        'Test City 2': [
          {
            zipcode: '22222',
            city: 'Test City 2',
            state: 'Test State 2',
            stateAbbreviation: 'TS2',
            county: 'Test County 2',
            latitude: 0,
            longitude: 0,
          },
        ],
        'Test City 3': [
          {
            zipcode: '33333',
            city: 'Test City 3',
            state: 'Test State 3',
            stateAbbreviation: 'TS3',
            county: 'Test County 3',
            latitude: 0,
            longitude: 0,
          },
        ],
      };
    });

    it('should return the top 3 matching zipcodes for a valid city', () => {
      const inputCity = 'Test City';
      const expectedZipcodes: ZipcodeSearchDto[] = [
        {
          zipcode: '11111',
          city: 'Test City 1',
          state: 'Test State 1',
          stateAbbreviation: 'TS1',
          county: 'Test County 1',
          latitude: 0,
          longitude: 0,
          score: expect.any(Number),
        },
        {
          zipcode: '22222',
          city: 'Test City 2',
          state: 'Test State 2',
          stateAbbreviation: 'TS2',
          county: 'Test County 2',
          latitude: 0,
          longitude: 0,
          score: expect.any(Number),
        },
        {
          zipcode: '33333',
          city: 'Test City 3',
          state: 'Test State 3',
          stateAbbreviation: 'TS3',
          county: 'Test County 3',
          latitude: 0,
          longitude: 0,
          score: expect.any(Number),
        },
      ];

      const result = zipcodeService.getTop3MatchingZipcodes(inputCity);

      expect(result).toEqual(expectedZipcodes);
    });
  });
});
