import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthContext } from '@auth';

@Component({
  selector: 'vt-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  router = inject(Router);
  authContext = inject(AuthContext);
  authStore = this.authContext.getStore();
  userContext = this.authStore.userContext;
  isAuth = this.authStore.isAuth;

  goToMyProfile(): void {
    this.router.navigate(['/my-profile']);
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }

  signOut(): void {
    this.authContext.signOut();
  }
}
