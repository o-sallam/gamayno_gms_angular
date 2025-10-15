export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  type: string;
  category?: string|null;
  description?: string|null;
  createdAt: Date;
  updatedAt: Date;
}
