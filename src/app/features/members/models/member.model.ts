export interface Member {
  id: number;
  code: string;
  name: string;
  balance: number;
  debt: number;
  credit: number;
  address?: string;
  phone?: string;
  subscription?: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
}
