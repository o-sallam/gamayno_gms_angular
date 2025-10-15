import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'members',
    loadComponent: () =>
      import('./features/members/pages/members/members.component').then(
        (m) => m.Members
      ),
  },
  {
    path: 'members/:id',
    loadComponent: () =>
      import(
        './features/members/pages/members-details/members-details.component'
      ).then((m) => m.MembersDetailsComponent),
  },
  {
    path: 'expenses',
    loadComponent: () =>
      import('./features/expenses/pages/expenses/expenses.component').then(
        (m) => m.ExpensesComponent
      ),
  },
  {
    path: 'revenues',
    loadComponent: () =>
      import('./features/revenues/pages/revenues/revenues.component').then(
        (m) => m.RevenuesComponent
      ),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import(
        './features/transactions/pages/transactions/transactions.component'
      ).then((m) => m.TransactionsComponent),
  },
  {
    path: '',
    redirectTo: '/members',
    pathMatch: 'full',
  },
];
