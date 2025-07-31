import { Customer } from 'src/domains/customer/entity/customer';
import { v4 as uuidv4 } from 'uuid';

export class Trip {
  id: string;
  customerID: string;
  tanggalMulaiPerjalanan: Date;
  tanggalBerakhirPerjalanan: Date;
  destinasiPerjalanan: string;
  createdAt: Date;
  updatedAt: Date;
  customer?: Customer;

  constructor(
    props?: Partial<
      Omit<Trip, 'tanggalMulaiPerjalanan' | 'tanggalBerakhirPerjalanan'>
    > & {
      tanggalMulaiPerjalanan?: string | Date;
      tanggalBerakhirPerjalanan?: string | Date;
    },
  ) {
    this.id = props?.id ?? uuidv4();
    this.customerID = props?.customerID ?? '';
    this.tanggalMulaiPerjalanan = props?.tanggalMulaiPerjalanan
      ? new Date(props.tanggalMulaiPerjalanan)
      : new Date();
    this.tanggalBerakhirPerjalanan = props?.tanggalBerakhirPerjalanan
      ? new Date(props.tanggalBerakhirPerjalanan)
      : new Date();
    this.destinasiPerjalanan = props?.destinasiPerjalanan ?? '';
    this.createdAt = props?.createdAt ?? new Date();
    this.updatedAt = props?.updatedAt ?? new Date();
    this.customer = props?.customer;
  }
}
