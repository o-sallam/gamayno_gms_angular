import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  template: `
    <div
      class="w-[250px] h-screen bg-black text-primary flex flex-col shadow-[0_0_28px_0_rgba(82,63,105,0.13)]"
    >
      <!-- Logo -->
      <div
        class="px-6 pt-6 pb-4 border-b border-[#2b2b40] flex items-center justify-between"
      >
        <h2 class="text-white text-2xl font-semibold m-0">Gamayno GMS</h2>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-col p-4 space-y-1 flex-1">
        @for (item of menuItems; track $index) {
        <a
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-2 px-4 py-3 text-[#a2a3b7] rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5 hover:text-white [&.active]:bg-[#121212] [&.active]:text-[#c1f429]"
        >
          <img
            [src]="item.icon"
            [alt]="item.label"
            [title]="item.label"
            width="24"
            height="24"
          />
          <span class="text-[0.95rem] font-medium [&.active]:text-[#c1f429]">{{
            item.label
          }}</span>
        </a>
        }
      </nav>
    </div>
  `,
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'assets/icons/dashboard.svg', route: '/' },
    { label: 'Members', icon: 'assets/icons/users.svg', route: '/members' },
    { label: 'Expenses', icon: 'assets/icons/expenses.svg', route: '/expenses' },
    { label: 'Cash', icon: 'assets/icons/money.svg', route: '/cash' },
  ];
}
