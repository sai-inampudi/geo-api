import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /zipcodes/:zipcode', () => {
    it('return Zipcode details successfully when zipcode exists', () => {
      const expected = {
        zipcode: '00501',
        city: 'Holtsville',
        state: 'New York',
        stateAbbreviation: 'NY',
        county: 'Suffolk',
        latitude: 40.8154,
        longitude: -73.0451,
      };
      return request(app.getHttpServer())
        .get('/zipcodes/00501')
        .expect(200)
        .expect(JSON.stringify(expected));
    });

    it('return 404 when zipcode is not found', () => {
      return request(app.getHttpServer()).get('/zipcodes/99999').expect(404);
    });

    it('return 400 when zipcode is invalid', () => {
      return request(app.getHttpServer()).get('/zipcodes/abcde').expect(400);
    });
  });

  describe('POST /zipcodes', () => {
    it('should return top 3 matching zipcodes successfully when the best matched city has more than 3 zipcodes', () => {
      const expected = [
        {
          zipcode: '66051',
          city: 'Olathe',
          state: 'Kansas',
          stateAbbreviation: 'KS',
          county: 'Johnson',
          latitude: 38.8999,
          longitude: -94.832,
          score: 1,
        },
        {
          zipcode: '66061',
          city: 'Olathe',
          state: 'Kansas',
          stateAbbreviation: 'KS',
          county: 'Johnson',
          latitude: 38.8865,
          longitude: -94.8204,
          score: 1,
        },
        {
          zipcode: '66062',
          city: 'Olathe',
          state: 'Kansas',
          stateAbbreviation: 'KS',
          county: 'Johnson',
          latitude: 38.8733,
          longitude: -94.7752,
          score: 1,
        },
      ];

      return (
        request(app.getHttpServer())
          .post('/zipcodes')
          /**
           * Olathe is a good city to test because the exact match (Olathe) has
           * more than 3 zipcodes, so we can test that just the top 3 are returned.
           */
          .send({ city: 'Olathe' })
          .expect(201)
          .expect(JSON.stringify(expected))
      );
    });

    it('should be able to return matching zipcodes from different cities', () => {
      const expected = [
        {
          zipcode: '63043',
          city: 'Maryland Heights',
          state: 'Missouri',
          stateAbbreviation: 'MO',
          county: 'St. Louis',
          latitude: 38.7229,
          longitude: -90.4474,
          score: 0.9375,
        },
        {
          zipcode: '08732',
          city: 'Island Heights',
          state: 'New Jersey',
          stateAbbreviation: 'NJ',
          county: 'Ocean',
          latitude: 39.9432,
          longitude: -74.1468,
          score: 0.6666666666666666,
        },
        {
          zipcode: '17832',
          city: 'Marion Heights',
          state: 'Pennsylvania',
          stateAbbreviation: 'PA',
          county: 'Northumberland',
          latitude: 40.8046,
          longitude: -76.4651,
          score: 0.6666666666666666,
        },
      ];

      return request(app.getHttpServer())
        .post('/zipcodes')
        .send({ city: 'Maryland Hights' })
        .expect(201)
        .expect(JSON.stringify(expected));
    });

    it('should return 400 when city is not provided', () => {
      return request(app.getHttpServer()).post('/zipcodes').expect(400);
    });

    it('should return 400 when city is empty', () => {
      return request(app.getHttpServer())
        .post('/zipcodes')
        .send({ city: '' })
        .expect(400);
    });

    it('should return 400 when city is not a string', () => {
      return request(app.getHttpServer())
        .post('/zipcodes')
        .send({ city: 12345 })
        .expect(400);
    });
  });
});
