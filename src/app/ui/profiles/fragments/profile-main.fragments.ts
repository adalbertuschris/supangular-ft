import { Router } from '@angular/router';
import { fragment } from '@web-fragments/ng-fragments';
import { AuthContext } from '@auth';
import { Input } from '@core';
import { getProfileApi$, updateProfileApi$ } from '@data/profiles';
import { ProfileUpsert } from '../models/profile-upsert';
import { ProfileContext } from './profile.context';

export const loadProfile$ = fragment(async ({ _exec, _inject, store$, form$ }: ProfileContext) => {
  const store = _exec(store$);
  store.loadProfile();

  const userId = _inject(AuthContext).getStore().state().session.user.id;
  const { data } = await _exec(getProfileApi$, userId);
  if (data) {
    store.loadProfileSuccess(data);
    _exec(form$).updateForm(data);
  } else {
    store.loadProfileFailure();
  }
});

export const updateProfile$ = fragment<{ id: string; model: ProfileUpsert }, Promise<void>>(
  async ({ _input, _exec, _inject, store$ }: ProfileContext & Input<{ id: string; model: ProfileUpsert }>) => {
    const store = _exec(store$);
    store.updateProfile();
    const { data } = await _exec(updateProfileApi$, _input);

    if (data) {
      store.updateProfileSuccess(data);
      _inject(AuthContext).reloadUserContext();
      _inject(Router).navigate(['/']);
    } else {
      store.updateProfileFailure();
    }
  }
);
