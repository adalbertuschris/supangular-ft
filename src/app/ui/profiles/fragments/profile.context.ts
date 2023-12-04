import { Injectable } from '@angular/core';
import { ExecutionContext, FragmentType, build, contextBuilder, fragments, methods } from '@web-fragments/ng-fragments';
import { ProfileUpsert } from '../models/profile-upsert';
import { loadProfile$, updateProfile$ } from './profile-main.fragments';
import { ProfileStore, store$ } from './profile-store.fragment';
import { ProfileForm, form$ } from './profile-form.fragment';

export type ProfileInternalContext = {
  store$: FragmentType<typeof store$>;
  form$: FragmentType<typeof form$>;
} & ExecutionContext;

@Injectable()
export class ProfileContext
  extends build(
    contextBuilder(),
    fragments({
      store$,
      form$
    }),
    methods(({ _exec, store$, form$ }) => ({
      getStore: (): ProfileStore => _exec(store$),
      getForm: (): ProfileForm => _exec(form$),
      loadProfile: (): Promise<void> => _exec(loadProfile$),
      updateProfile: (id: string, model: ProfileUpsert): Promise<void> => _exec(updateProfile$, { id, model })
    }))
  )
  implements ProfileInternalContext {}
