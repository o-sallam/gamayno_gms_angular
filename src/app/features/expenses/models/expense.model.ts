export interface Expense {
  id?: number;
  amount: number;
  date: Date;
  description: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PartialExpense = Partial<Expense>;