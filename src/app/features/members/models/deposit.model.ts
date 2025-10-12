export interface Deposit {
  id: number;
  memberId: number;
  amount: number;
  description?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
