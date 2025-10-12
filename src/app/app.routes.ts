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
    path: '',
    redirectTo: '/members',
    pathMatch: 'full',
  },
];
