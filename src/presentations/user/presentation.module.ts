import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/applications/application.module';
import { UserController } from './controller/user.controller';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [UserController, AuthController],
})
export class PresentationModule {}
