/**
 * This file is directly "inspired" from https://developer.okta.com/blog/2021/02/22/first-nestjs-application
 */

import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`${process.env.NODE_ENV || ''}.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
