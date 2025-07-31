import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/applications/application.module';
import { UserController } from './controller/user.controller';
import { AuthController } from './controller/auth.controller';
import { CustomerController } from '../customer/controller/customer.controller';
import { TripController } from '../trip/controller/trip.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [
    UserController,
    AuthController,
    CustomerController,
    TripController,
  ],
})
export class PresentationModule {}
