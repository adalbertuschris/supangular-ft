import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '@ui/shared';
import { MyProfilePageComponent } from './pages/my-profile-page/my-profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: MyProfilePageComponent
  }
];

@NgModule({
  declarations: [MyProfilePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent
  ],
  providers: []
})
export class ProfilesModule {}
