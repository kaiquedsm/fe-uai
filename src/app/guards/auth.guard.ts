import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const usuarioService = inject(UserService);
  const router = inject(Router);

  const token = usuarioService.dadosLogin?.value?.body?.token;
  if (token) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
