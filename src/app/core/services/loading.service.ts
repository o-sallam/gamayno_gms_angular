import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // a signal to track global loading state
  private readonly _loading = signal(false);

  // public readonly getter (to expose in components)
  readonly loading = this._loading.asReadonly();

  setLoading(state: boolean) {
    if (!state) {
      console.log('loading false');
    }
    this._loading.set(state);
  }
}
