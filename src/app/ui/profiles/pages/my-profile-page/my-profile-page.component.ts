import { Component, inject } from '@angular/core';
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
  isLoading = this.store.isLoading;
  profile = this.store.profile;

  constructor() {
    this.context.loadProfile();
  }

  updateProfile(profileId: string): void {
    const model: ProfileUpsert = this.profileForm.value as ProfileUpsert;
    this.context.updateProfile(profileId, model);
  }
}
