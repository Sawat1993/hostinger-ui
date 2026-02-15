import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonService } from '../services/common.service';

export const authGuard: CanActivateFn = (route, state) => {
  const commonService = inject(CommonService);
  const router = inject(Router);
  if (!commonService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
