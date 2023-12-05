import { Injectable, effect, untracked } from '@angular/core';
import {
  ExecutionContext,
  FragmentType,
  build,
  contextBuilder,
  fragments,
  hooks,
  methods
} from '@web-fragments/ng-fragments';
import { AuthStore, store$ } from './auth-store.fragment';
import { checkAuth$, loadUserContext$, reloadUserContext$, signInViaLoginLink$, signOut$ } from './main.fragments';

export type AuthInternalContext = {
  store$: FragmentType<typeof store$>;
} & ExecutionContext;

@Injectable({ providedIn: 'root' })
export class AuthContext
  extends build(
    contextBuilder(),
    fragments({
      store$
    }),
    methods(({ _exec, store$ }) => ({
      getStore: (): AuthStore => _exec(store$),
      checkAuth: (): Promise<void> => _exec(checkAuth$), // _exec(loadUserContext$)
      signIn: (email: string): Promise<void> => _exec(signInViaLoginLink$, email), // _exec(loadUserContext$)
      signOut: (): Promise<void> => _exec(signOut$),
      reloadUserContext: (): Promise<void> => _exec(reloadUserContext$)
    })),
    hooks(({ _exec, store$ }) => ({
      onInit: (): void => {
        const store = _exec(store$);
        const isAuth = store.isAuth;
        const userContext = store.userContext;
        let isLoadingUserContext = false;

        effect(() => {
          if (isAuth() && !untracked(() => userContext()) && !isLoadingUserContext) {
            const userId = untracked(() => store.session()).user.id;
            isLoadingUserContext = true;

            setTimeout(async () => {
              await _exec(loadUserContext$, userId);
              isLoadingUserContext = false;
            });
          }
        });
      }
    }))
  )
  implements AuthInternalContext {}
