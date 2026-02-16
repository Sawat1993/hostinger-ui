
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CommonService } from './common.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const commonService = inject(CommonService);
  const token = commonService.getToken();
  if (token) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }
  return next(req);
};
