export interface Member {
  id: number;
  code: string;
  name: string;
  balance: number;
  paidFee: number;
  leftToPay: number;
  address?: string;
  phone?: string;
  subscription?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  suspensionCount?: number;
  monthCount?: number;
}
