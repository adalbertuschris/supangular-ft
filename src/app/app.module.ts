import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppInitService } from '@core';
import { G11nModule } from '@g11n';
import { ButtonComponent } from '@ui/shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataModule } from './data/data.module';
import { HomePageComponent } from './ui/main/pages/home-page/home-page.component';

export function appInitializer(appInitService: AppInitService): () => void {
  return () => appInitService.init();
}

@NgModule({
  declarations: [AppComponent, HomePageComponent],
  imports: [BrowserModule, AppRoutingModule, DataModule, G11nModule, ButtonComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
