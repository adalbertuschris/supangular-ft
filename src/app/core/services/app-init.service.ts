import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthContext } from '@auth';

@Injectable({ providedIn: 'root' })
export class AppInitService {
  constructor(
    private readonly authContext: AuthContext,
    private readonly translateService: TranslateService
  ) {}

  init(): void {
    this.authContext.checkAuth();
    this.translateService.use('en-US');
  }
}
