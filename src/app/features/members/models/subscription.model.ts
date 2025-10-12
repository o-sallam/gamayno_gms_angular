export interface Subscription {
  id: number;
  memberId: number;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  monthCount: number;
  balance: number;
  paidFee: number;
  leftToPay: number;
}
