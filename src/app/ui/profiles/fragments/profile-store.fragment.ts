import {
  FragmentResultType,
  build,
  signalState,
  storeBuilder,
  storeFragment,
  updaters
} from '@web-fragments/ng-fragments';
import { ProfileResponse } from '@data/profiles';
import { Profile } from '../models/profile';

interface ProfileState {
  [key: string]: unknown; // TEMP
  profile: Profile;
  isLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false
};

export type ProfileStore = FragmentResultType<typeof store$>;

export const store$ = storeFragment(() => {
  const store = build(
    storeBuilder(signalState(initialState)),
    updaters(({ update }) => ({
      loadProfile: (): void => update((state) => ({ ...state, isLoading: true })),

      loadProfileSuccess: (profile: ProfileResponse): void =>
        update((state) => ({ ...state, profile, isLoading: false })),

      loadProfileFailure: (): void => update((state) => ({ ...state, profile: null, isLoading: false })),

      updateProfile: (): void => update((state) => ({ ...state, isLoading: true })),

      updateProfileSuccess: (profile: ProfileResponse): void =>
        update((state) => ({ ...state, profile, isLoading: false })),

      updateProfileFailure: (): void => update((state) => ({ ...state, isLoading: false }))
    }))
  );

  return store;
});
