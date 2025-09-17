import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { ENABLE_ERROR } from './loading.interceptor';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  const useError = req.context.get(ENABLE_ERROR);

  return next(req).pipe(
    catchError((err) => {
      if (useError) {
        errorService.setError(err?.message || 'Unknown error');
      }
      return throwError(() => err);
    })
  );
};
