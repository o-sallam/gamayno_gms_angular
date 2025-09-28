import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { MessageService } from '../services/message.service';
import { ENABLE_ERROR, ENABLE_SUCCESS } from './http-context-tokens';

export const messageInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  const useError = req.context.get(ENABLE_ERROR);
  const useSuccess = req.context.get(ENABLE_SUCCESS);

  return next(req).pipe(
    tap((event: any) => {
      if (useSuccess) {
        // You can customize this (maybe based on request URL or method)
        messageService.setSuccess('Operation completed successfully!');
      }
    }),
    catchError((err) => {
      if (useError) {
        messageService.setError(err?.message || 'Unknown error');
      }
      return throwError(() => err);
    })
  );
};
