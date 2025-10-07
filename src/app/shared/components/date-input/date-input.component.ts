import {
  Component,
  Optional,
  Self,
  input,
  signal,
  computed,
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  standalone: true,
  imports: [DatePickerModule, FormsModule, ReactiveFormsModule],
})
export class DateInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  inputClass = input<string>('');
  dateFormat = input<string>('dd/mm/yy');
  showIcon = input<boolean>(true);

  value = signal<Date | null>(null);

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(obj: any): void {
    this.value.set(obj ? new Date(obj) : null);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    try {
      (this.disabled as any).set?.(isDisabled);
    } catch {}
  }

  onSelect(date: Date | null) {
    this.value.set(date);
    this._onChange(date);
  }

  onBlur() {
    this._onTouched();
  }

  get control() {
    return this.ngControl?.control;
  }

  status = toSignal(this.control?.statusChanges ?? EMPTY, {
    initialValue: this.control?.status ?? 'VALID',
  });

  errorMessage = computed(() => {
    this.status();
    const c = this.control;
    if (!c || !c.errors) return null;
    if (c.errors['required']) return 'This field is required';
    if (c.errors['min']) return 'Date is too early';
    if (c.errors['max']) return 'Date is too late';
    if (c.errors['matDatepickerParse'] || c.errors['date'])
      return 'Invalid date';
    return 'Invalid';
  });
}
