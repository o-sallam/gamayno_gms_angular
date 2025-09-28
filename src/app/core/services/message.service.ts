import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  // signal to hold the latest error message
  private readonly _error = signal<string | null>(null);
  private readonly _success = signal<string | null>(null);

  // public readonly getter
  readonly error = this._error.asReadonly();
  readonly success = this._success.asReadonly();

  setError(message: string | null) {
    console.log('setError', message);
    this._error.set(message);
  }

  clearError() {
    this._error.set(null);
  }

  setSuccess(message: string | null) {
    this._success.set(message);
  }

  clearSuccess() {
    this._success.set(null);
  }
}
