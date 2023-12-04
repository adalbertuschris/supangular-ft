import { Component, Signal, inject } from '@angular/core';
import { Profile } from '../../models/profile';
import { ProfileContext } from '../../fragments/profile.context';
import { ProfileUpsert } from '../../models/profile-upsert';

@Component({
  selector: 'vt-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.scss'],
  providers: [ProfileContext]
})
export class MyProfilePageComponent {
  context = inject(ProfileContext);
  formManager = this.context.getForm();
  profileForm = this.formManager.form;
  store = this.context.getStore();
  isLoading: Signal<boolean> = this.store.select((state) => state.isLoading);
  profile: Signal<Profile> = this.store.select((state) => state.profile);

  constructor() {
    this.context.loadProfile();
  }

  updateProfile(profileId: string): void {
    const model: ProfileUpsert = this.profileForm.value as ProfileUpsert;
    this.context.updateProfile(profileId, model);
  }
}
