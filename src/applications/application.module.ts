import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  CUSTOMER_SERVICE,
  TRIP_SERVICE,
  USER_SERVICE,
} from 'src/shared/constant';
import { UserService } from './account/services/user.service';
import { AuthService } from './account/services/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InfrastructureModule } from 'src/infrastructures/infrastructure.module';
import { CustomerService } from './customer/services/customer.service';
import { TripService } from './trip/services/trip.service';

@Module({
  imports: [
    InfrastructureModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: CUSTOMER_SERVICE,
      useClass: CustomerService,
    },
    {
      provide: TRIP_SERVICE,
      useClass: TripService,
    },
  ],
  exports: [USER_SERVICE, AUTH_SERVICE, CUSTOMER_SERVICE, TRIP_SERVICE],
})
export class ApplicationModule {}
