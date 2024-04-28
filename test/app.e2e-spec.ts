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
    it('return top 3 matching cities successfully', () => {
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
  });
});
