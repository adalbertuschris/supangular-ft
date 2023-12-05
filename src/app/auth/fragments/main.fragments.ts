import { Router } from '@angular/router';
import { fragment } from '@web-fragments/ng-fragments';
import { getSessionApi$, getUserContextApi$, signInViaLoginLinkApi$, signOutApi$ } from '@data/auth';
import { Input } from '../../core';
import { AuthInternalContext } from './auth.context';

export const checkAuth$ = fragment(async ({ _exec, store$ }: AuthInternalContext) => {
  const { data } = await _exec(getSessionApi$);
  const store = _exec(store$);

  if (data?.session) {
    store.userAuthenticated(data.session);
  } else {
    store.userNotAuthenticated();
  }
});

export const signInViaLoginLink$ = fragment(
  async ({ _exec, store$, _input: email }: AuthInternalContext & Input<string>) => {
    const { error } = await _exec(signInViaLoginLinkApi$, email);
    const store = _exec(store$);

    if (!error) {
      store.loginLinkSent();
    } else {
      store.signInFailure();
    }
  }
);

export const loadUserContext$ = fragment(
  async ({ _exec, store$, _input: userId }: AuthInternalContext & Input<string>) => {
    const store = _exec(store$);
    store.loadUserContext();
    const { data, error } = await _exec(getUserContextApi$, userId);

    if (!error) {
      store.loadUserContextSuccess(data);
    } else {
      store.loadUserContextFailure();
    }
  }
);

export const reloadUserContext$ = fragment(async ({ _exec, store$ }: AuthInternalContext) => {
  const store = _exec(store$);
  const { state } = store;

  if (state().userContext) {
    const userId = state().userContext.id;
    _exec(loadUserContext$, userId);
  }
});

export const signOut$ = fragment(async ({ _exec, _inject, store$ }: AuthInternalContext) => {
  const store = _exec(store$);
  const { error } = await _exec(signOutApi$);

  if (!error) {
    store.signOutSuccess();
    _inject(Router).navigate(['/login']);
  }
});
