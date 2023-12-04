import { Router } from '@angular/router';
import { lastValueFrom, take } from 'rxjs';
import { fragment } from '@web-fragments/ng-fragments';
import { AuthService } from '@auth';
import { getProfileApi$, updateProfileApi$ } from '@data/profiles';
import { ProfileUpsert } from '../models/profile-upsert';
import { ProfileContext } from './profile.context';
import { Profile } from '../models/profile';

// TEMP
type Input<T> = { _input: T };

export const loadProfile$ = fragment(async ({ _exec, _inject, store$, form$ }: ProfileContext) => {
  const authService = _inject(AuthService);
  const { loadProfile, loadProfileSuccess, loadProfileFailure } = _exec(store$);
  loadProfile();
  const userContext = await lastValueFrom(authService.userContext$.pipe(take(1)));
  const { data } = await _exec(getProfileApi$, userContext.id);
  if (data) {
    loadProfileSuccess(data);
    _exec(form$).updateForm(data);
  } else {
    loadProfileFailure();
  }
});

export const updateProfileSuccess$ = fragment<Profile, Promise<void>>(
  async ({ _input, _exec, _inject, store$ }: ProfileContext & Input<Profile>) => {
    _exec(store$).updateProfileSuccess(_input);
    _inject(AuthService).reloadUserContext();
    _inject(Router).navigate(['/']);
  }
);

export const updateProfile$ = fragment<{ id: string; model: ProfileUpsert }, Promise<void>>(
  async ({ _input, _exec, store$ }: ProfileContext & Input<{ id: string; model: ProfileUpsert }>) => {
    const { updateProfile, updateProfileFailure } = _exec(store$);
    updateProfile();
    const { data } = await _exec(updateProfileApi$, _input);
    if (data) {
      _exec(updateProfileSuccess$, data);
    } else {
      updateProfileFailure();
    }
  }
);
