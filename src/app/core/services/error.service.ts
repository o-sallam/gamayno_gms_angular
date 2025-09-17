import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  // signal to hold the latest error message
  private readonly _error = signal<string | null>(null);

  // public readonly getter
  readonly error = this._error.asReadonly();

  setError(message: string | null) {
    this._error.set(message);
  }

  clearError() {
    this._error.set(null);
  }
}
