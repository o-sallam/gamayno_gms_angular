import { inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';

export abstract class BaseForm {
  form: FormGroup;
  fb = inject(FormBuilder);

  constructor() {
    this.form = this.buildForm();
  }

  // Each subclass defines its own form structure
  protected abstract buildForm(): FormGroup;

  // Helpers
  getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  isInvalid(controlName: string): boolean {
    const control = this.getControl(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasError(controlName: string, errorCode: string): boolean {
    const control = this.getControl(controlName);
    return !!(
      control &&
      control.hasError(errorCode) &&
      (control.dirty || control.touched)
    );
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }
}
