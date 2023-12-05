import {
  FragmentResultType,
  build,
  props,
  signalState,
  storeBuilder,
  storeFragment
} from '@web-fragments/ng-fragments';
import { AuthSession, AuthUser, UserContext } from '@auth';

export interface AuthState {
  [key: string]: unknown; // TEMP
  isAuth: boolean;
  authUser: AuthUser;
  userContext: UserContext;
  session: AuthSession;
  isSigningIn: boolean;
  isLoadingUserContext: boolean;
  loginLinkSent: boolean;
}

const initialState: AuthState = {
  isAuth: undefined,
  authUser: undefined,
  userContext: undefined,
  session: undefined,
  isSigningIn: false,
  isLoadingUserContext: false,
  loginLinkSent: false
};

export type AuthStore = FragmentResultType<typeof store$>;

export const store$ = storeFragment(() => {
  const state = signalState(initialState);
  const { update, select } = state;

  // Getters
  const isAuth = select((state) => state.isAuth);
  const userContext = select((state) => state.userContext);
  const session = select((state) => state.session);
  const isSigningIn = select((state) => state.isSigningIn);

  // Updaters
  const signInViaLoginLink = (): void => update((state) => ({ ...state, isSigningIn: true }));

  const loginLinkSent = (): void => update((state) => ({ ...state, loginLinkSent: true, isSigningIn: false }));

  const signInFailure = (): void => update((state) => ({ ...state, isSigningIn: false }));

  const userAuthenticated = (session: AuthSession): void => update((state) => ({ ...state, session, isAuth: true }));

  const userNotAuthenticated = (): void =>
    update((state) => ({ ...state, session: null, userContext: null, isAuth: false }));

  const loadUserContext = (): void =>
    update((state) => ({
      ...state,
      isLoadingUserContext: true
    }));

  const loadUserContextSuccess = (userContext: UserContext): void =>
    update((state) => ({
      ...state,
      userContext: { email: state.session.user.email, ...userContext },
      isLoadingUserContext: false
    }));

  const loadUserContextFailure = (): void =>
    update((state) => ({ ...state, userContext: null, isLoadingUserContext: false }));

  const signOutSuccess = (): void => update((state) => ({ ...state, userContext: null, session: null, isAuth: false }));

  return build(
    storeBuilder(state),
    props({
      isAuth,
      userContext,
      session,
      isSigningIn,
      signInViaLoginLink,
      loginLinkSent,
      signInFailure,
      userAuthenticated,
      userNotAuthenticated,
      loadUserContext,
      loadUserContextSuccess,
      loadUserContextFailure,
      signOutSuccess
    })
  );
});
