import {
  FragmentResultType,
  build,
  props,
  signalState,
  storeBuilder,
  storeFragment
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
  const state = signalState(initialState);
  const { update, select } = state;

  // Getters
  const isLoading = select((state) => state.isLoading);
  const profile = select((state) => state.profile);

  // Updaters
  const loadProfile = (): void => update((state) => ({ ...state, isLoading: true }));

  const loadProfileSuccess = (profile: ProfileResponse): void =>
    update((state) => ({ ...state, profile, isLoading: false }));

  const loadProfileFailure = (): void => update((state) => ({ ...state, profile: null, isLoading: false }));

  const updateProfile = (): void => update((state) => ({ ...state, isLoading: true }));

  const updateProfileSuccess = (profile: ProfileResponse): void =>
    update((state) => ({ ...state, profile, isLoading: false }));

  const updateProfileFailure = (): void => update((state) => ({ ...state, isLoading: false }));

  return build(
    storeBuilder(state),
    props({
      isLoading,
      profile,
      loadProfile,
      loadProfileSuccess,
      loadProfileFailure,
      updateProfile,
      updateProfileSuccess,
      updateProfileFailure
    })
  );
});
