import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';
import { ENABLE_LOADING } from './http-context-tokens';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  const useLoading = req.context.get(ENABLE_LOADING);

  if (!useLoading) {
    return next(req);
  }

  loadingService.setLoading(true);

  return next(req).pipe(finalize(() => loadingService.setLoading(false)));
};
