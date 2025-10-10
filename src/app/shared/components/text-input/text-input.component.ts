import {
  Component,
  forwardRef,
  input,
  signal,
  Optional,
  Self,
  computed,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  standalone: true,
  imports: [InputTextModule],
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'password' | 'email' | 'number'>('text');
  disabled = input<boolean>(false);
  min = input<number | null>(null);
  max = input<number | null>(null);
  // expose a class input so parent can forward classes
  inputClass = input<string>('');

  value = signal<string>('');
  onInputChange = output<string>();

  // ControlValueAccessor callbacks
  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  // optional: access host NgControl to show validation
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this; // ✅ avoid NG_VALUE_ACCESSOR circular dep
    }
  }

  // called by Angular forms to write a new value to the input
  writeValue(obj: any): void {
    this.value.set(obj ?? '');
  }

  // Angular provides this so we can call it when value changes
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  // optional: forms call this to toggle disabled
  setDisabledState(isDisabled: boolean): void {
    // use signal-based disabled setter (if your input() returns writable signal)
    // otherwise fallback to local state or a private flag
    try {
      // some Angular versions allow setting input() signals; if not, store locally:
      (this.disabled as any).set?.(isDisabled);
    } catch {
      // no-op fallback (or maintain local disabled state)
    }
  }

  // local handler when user types
  onInput(value: string) {
    this.value.set(value);
    this._onChange(value);
    this.onInputChange.emit(value);
  }

  // on blur (mark touched)
  onBlur() {
    this._onTouched();
  }

  // helper for validation UI
  get control() {
    return this.ngControl?.control;
  }
  status = toSignal(this.control?.statusChanges ?? EMPTY, {
    initialValue: this.control?.status ?? 'VALID',
  });
  errorMessage = computed(() => {
    this.status(); // 👈 dependency for reactivity

    const c = this.control;
    c?.status;
    if (!c || !c.errors) return null;

    if (c.errors['required']) return 'This field is required';
    if (c.errors['minlength']) {
      const req = c.errors['minlength'].requiredLength;
      return `Minimum ${req} characters required`;
    }
    if (c.errors['maxlength']) {
      const max = c.errors['maxlength'].requiredLength;
      return `Maximum ${max} characters allowed`;
    }
    if (c.errors['pattern']) return 'Invalid format';
    return 'Invalid';
  });
}
