import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConnectionSource } from './infrastructures/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infrastructures/infrastructure.module';
import { ApplicationModule } from './applications/application.module';
import configuration from './infrastructures/config/app.config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './shares/filters/http-exception.filter';
import { CacheModule } from '@nestjs/cache-manager';
import { KeyvOptions } from './infrastructures/config/redis.config';
import { PresentationModule } from './presentations/user/presentation.module';
import { AuthGuard } from './shares/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      load: [configuration],
    }),
    TypeOrmModule.forRoot(DBConnectionSource.options),
    CacheModule.registerAsync(KeyvOptions),
    InfrastructureModule,
    ApplicationModule,
    PresentationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
