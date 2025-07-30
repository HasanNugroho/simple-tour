import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConnectionSource } from './infrastructures/config/database.config';
import { ConfigModule } from '@nestjs/config';
import { InfrastructureModule } from './infrastructures/infrastructure.module';
import { ApplicationModule } from './applications/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    TypeOrmModule.forRoot(DBConnectionSource.options),
    InfrastructureModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
