/**
 * This file is directly "inspired" from https://developer.okta.com/blog/2021/02/22/first-nestjs-application
 */

import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { AuthService } from './auth.service';
import { HttpStrategy } from './http.strategy';

@Module({
  imports: [ConfigModule],
  providers: [HttpStrategy, AuthService],
})
export class AuthModule {}
