import { Validators } from '@angular/forms';
import { FragmentResultType, formFragment } from '@web-fragments/ng-fragments';
import { Profile } from '../models/profile';

export type ProfileForm = FragmentResultType<typeof form$>;

export const form$ = formFragment(({ _formBuilder }) => {
  const form = _formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ''
  });

  const updateForm = (profile: Profile): void => {
    form.patchValue({
      firstName: profile?.firstName,
      lastName: profile?.lastName
    });
  };

  return { form, updateForm };
});
