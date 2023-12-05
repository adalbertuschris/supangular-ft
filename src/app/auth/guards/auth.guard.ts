import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthContext } from '../fragments/auth.context';

export const authGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authContext = inject(AuthContext);
  const isAuth = authContext.getStore().isAuth;
  await authContext.checkAuth();

  return isAuth() ? true : router.createUrlTree(['/login']);
};
