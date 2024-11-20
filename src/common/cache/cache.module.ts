import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CustomCacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 1 * 60 * 1000,
    }),
  ],
  providers: [CustomCacheService],
  exports: [CustomCacheService],
})
export class CustomCacheModule {}
