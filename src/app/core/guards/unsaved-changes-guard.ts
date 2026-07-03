import { CanActivateFn } from '@angular/router';

export const unsavedChangesGuard: CanActivateFn = (route, state) => {
  return true;
};
