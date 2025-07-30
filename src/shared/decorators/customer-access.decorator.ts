import { SetMetadata } from '@nestjs/common';
import { IS_ALLOW_CUSTOMER_KEY } from '../constant';

export const CustomerAllowed = () => SetMetadata(IS_ALLOW_CUSTOMER_KEY, true);
