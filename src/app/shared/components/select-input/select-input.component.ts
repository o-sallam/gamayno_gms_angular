import {
  Component,
  input,
  signal,
  output,
  computed,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  standalone: true,
  imports: [SelectModule, FormsModule],
})
export class SelectInputComponent implements ControlValueAccessor {
  // Inputs
  label = input<string>('');
  placeholder = input<string>('Select...');
  disabled = input<boolean>(false);
  options = input<any[]>([]);
  optionLabel = input<string>('label');
  optionValue = input<string>('value');
  selectClass = input<string>('');

  // Value signal
  value = signal<any>(null);
  onValueChange = output<any>();

  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ControlValueAccessor methods
  writeValue(obj: any): void {
    this.value.set(obj ?? null);
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

  // Events
  onSelect(value: any) {
    this.value.set(value);
    this._onChange(value);
    this.onValueChange.emit(value);
  }

  onBlur() {
    this._onTouched();
  }

  // Validation helpers
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
    if (c.errors['pattern']) return 'Invalid selection';
    return 'Invalid';
  });
}
