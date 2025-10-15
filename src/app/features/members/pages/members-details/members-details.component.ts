import {
  Component,
  OnInit,
  signal,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DetailsFieldComponent } from '../../../../shared/components/details-field/details-field.component';
import { TableComponent } from '../../../../shared/components/table/table.component';
import { MembersService } from '../../services/members.service';
import { Member } from '../../models/member.model';
import { Subscription } from '../../models/subscription.model';
import { Deposit } from '../../models/deposit.model';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CellTemplateDirective } from '../../../../shared/directives/cell-template.directive';
import { RenewSubscriptionDialogComponent } from '../../components/dialogs/renew-subscription-dialog/renew-subscription-dialog.component';
import { UpdateMemberDialogComponent } from '../../components/dialogs/update-member-dialog/update-member-dialog.component';
import { AddDepositDialogComponent } from '../../components/dialogs/add-deposit-dialog/add-deposit-dialog.component';
import { SuspensionDialogComponent } from '../../components/dialogs/suspension-dialog/suspension-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-members-details',
  standalone: true,
  imports: [
    CommonModule,
    DetailsFieldComponent,
    TableComponent,
    FormsModule,
    ReactiveFormsModule,
    CellTemplateDirective,
    RenewSubscriptionDialogComponent,
    UpdateMemberDialogComponent,
    AddDepositDialogComponent,
    SuspensionDialogComponent,
  ],
  templateUrl: './members-details.component.html',
  styleUrl: './members-details.component.scss',
})
export class MembersDetailsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  memberId!: number;
  member = signal<Member | null>(null);
  subscriptions = signal<Subscription[]>([]);
  deposits = signal<Deposit[]>([]);
  loading = signal(false);
  totalSubscriptionFee = signal<number | null>(null);
  paidFee = signal<number | null>(null);

  leftToPay = computed(() => {
    const total = this.totalSubscriptionFee() ?? 0;
    const paid = this.paidFee() ?? 0;
    return total - paid;
  });
  suspensionEndDate = signal<Date | null>(null);

  // Dialog state
  renewDialogVisible = signal(false);
  updateDialogVisible = signal(false);
  depositDialogVisible = signal(false);
  suspensionDialogVisible = signal(false);

  // Table columns for subscriptions
  subscriptionColumns = [
    { field: 'id', header: 'ID' },
    { field: 'createdAt', header: 'Created At' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'monthCount', header: 'Month Count' },
    { field: 'balance', header: 'Balance' },
    { field: 'paidFee', header: 'Paid Fee' },
    { field: 'leftToPay', header: 'Left to Pay' },
  ];

  // Table columns for deposits
  depositColumns = [
    { field: 'id', header: 'ID' },
    { field: 'createdAt', header: 'Created At' },
    { field: 'amount', header: 'Amount' },
    { field: 'description', header: 'Description' },
    { field: 'paymentMethod', header: 'Payment Method' },
    { field: 'referenceNumber', header: 'Reference' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private membersService: MembersService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.memberId = +params['id'];
      this.member.set({
        id: this.memberId,
        name: 'Harry Potter',
        code: '123456',
        address: '123 Main St',
        phone: '123-456-7890',
        balance: 1000,
        leftToPay: 400,
        paidFee: 600,
        subscription: 'active',
      });
      // this.loadMemberDetails();
      this.loadSubscriptions();
      this.loadDeposits();
    });
  }

  loadMemberDetails() {
    this.loading.set(true);
    this.membersService
      .getById(this.memberId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.member.set(response.data);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading member details:', error);
          this.loading.set(false);
        },
      });
  }

  loadSubscriptions() {
    this.membersService
      .getSubscriptionsByMemberId(this.memberId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.subscriptions.set(response.data);
        },
        error: (error) => {
          console.error('Error loading subscriptions:', error);
          // Fallback to mock data for development
          const mockSubscriptions: Subscription[] = [
            {
              id: 1,
              memberId: this.memberId,
              createdAt: new Date('2024-01-15'),
              startDate: new Date('2024-01-15'),
              endDate: new Date('2024-02-15'),
              monthCount: 1,
              balance: 1000,
              paidFee: 800,
              leftToPay: 200,
            },
            {
              id: 2,
              memberId: this.memberId,
              createdAt: new Date('2024-02-15'),
              startDate: new Date('2024-02-15'),
              endDate: new Date('2024-03-15'),
              monthCount: 1,
              balance: 1000,
              paidFee: 1000,
              leftToPay: 0,
            },
          ];
          this.subscriptions.set(mockSubscriptions);
        },
      });
  }

  loadDeposits() {
    // Mock data for deposits - in real app, this would be an API call
    const mockDeposits: Deposit[] = [
      {
        id: 1,
        memberId: this.memberId,
        amount: 500,
        createdAt: new Date('2024-01-10'),
        description: 'Initial deposit',
        paymentMethod: 'Bank Transfer',
        referenceNumber: 'BT001',
      },
      {
        id: 2,
        memberId: this.memberId,
        amount: 300,
        createdAt: new Date('2024-01-20'),
        description: 'Monthly deposit',
        paymentMethod: 'Cash',
        referenceNumber: 'CASH001',
      },
      {
        id: 3,
        memberId: this.memberId,
        amount: 200,
        createdAt: new Date('2024-02-05'),
        description: 'Additional deposit',
        paymentMethod: 'Card',
        referenceNumber: 'CARD001',
      },
    ];
    this.deposits.set(mockDeposits);
  }

  openRenewDialog() {
    this.renewDialogVisible.set(true);
  }

  closeRenewDialog() {
    this.renewDialogVisible.set(false);
  }

  onRenewSubscription(subscriptionData: any) {
    this.membersService
      .createSubscription(this.memberId, subscriptionData)
      .pipe(takeUntilDestroyed(this.destroyRef))

      .subscribe({
        next: (response) => {
          // Add the new subscription to the list
          this.subscriptions.set([...this.subscriptions(), response.data]);
          this.closeRenewDialog();
        },
        error: (error) => {
          console.error('Error creating subscription:', error);
          // Fallback: add to local list for development
          const newSubscription: Subscription = {
            id: this.subscriptions().length + 1,
            memberId: this.memberId,
            createdAt: new Date(),
            ...subscriptionData,
          };
          this.subscriptions.set([...this.subscriptions(), newSubscription]);
          this.closeRenewDialog();
        },
      });
  }

  onSubscriptionTableAction(event: any) {
    console.log('Subscription table action:', event);
  }

  goBack() {
    this.router.navigate(['/members']);
  }

  openUpdateDialog() {
    this.updateDialogVisible.set(true);
  }

  closeUpdateDialog() {
    this.updateDialogVisible.set(false);
  }
  openSuspensionDialog() {
    this.suspensionDialogVisible.set(true);
  }

  closeSuspensionDialog() {
    this.suspensionDialogVisible.set(false);
  }

  onUpdateMember(updateData: any) {
    this.membersService
      .update(this.memberId, updateData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          // Update the member data
          this.member.set(response.data);
          this.closeUpdateDialog();
        },
        error: (error) => {
          console.error('Error updating member:', error);
          // Fallback: update local data for development
          this.member.set({ ...this.member()!, ...updateData });
          this.closeUpdateDialog();
        },
      });
  }

  openDepositDialog() {
    this.depositDialogVisible.set(true);
  }

  closeDepositDialog() {
    this.depositDialogVisible.set(false);
  }

  onAddDeposit(depositData: any) {
    // Here you would typically call a service to add the deposit
    // For now, we'll simulate adding a deposit by updating the member's balance
    console.log('Adding deposit:', depositData);

    // Create new deposit object
    const newDeposit: Deposit = {
      id: this.deposits().length + 1,
      memberId: this.memberId,
      amount: depositData.amount,
      description: depositData.description,
      paymentMethod: depositData.paymentMethod,
      referenceNumber: depositData.referenceNumber,
      createdAt: new Date(),
    };

    // Add to deposits list
    this.deposits.set([...this.deposits(), newDeposit]);

    // Update member balance (simulation)
    if (this.member()) {
      const currentBalance = this.member()!.balance || 0;
      const newBalance = currentBalance + depositData.amount;

      this.member.set({
        ...this.member()!,
        balance: newBalance,
      });
    }

    this.closeDepositDialog();

    // Show success message (you can implement a toast service)
    console.log('Deposit added successfully!');
  }
  onSuspendMember(suspensionData: any) {
    // Here you would typically call a service to suspend the member
    // For now, we'll simulate suspension by updating the member's status
    console.log('Suspending member:', suspensionData);
  }
}
