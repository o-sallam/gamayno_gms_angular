import {
  Component,
  forwardRef,
  input,
  signal,
  Optional,
  Self,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.html',
  styleUrls: ['./text-input.scss'],
  imports: [InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'password' | 'email'>('text');
  disabled = input<boolean>(false);
  // expose a class input so parent can forward classes
  inputClass = input<string>('');

  value = signal<string>('');

  // ControlValueAccessor callbacks
  private _onChange: (v: any) => void = () => {};
  private _onTouched: () => void = () => {};

  // optional: access host NgControl to show validation
  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      // tell Angular forms that this component is the value accessor
      this.ngControl.valueAccessor = this;
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
    this._onChange(value); // propagate to form
  }

  // on blur (mark touched)
  onBlur() {
    this._onTouched();
  }

  // helper for validation UI
  get control() {
    return this.ngControl?.control;
  }

  getErrorMessage(): string | null {
    const c = this.control;
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
    // add more mappings as needed
    return 'Invalid';
  }
}
