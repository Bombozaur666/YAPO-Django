import {
  ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject, provideAppInitializer,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import { provideTranslateHttpLoader } from "@ngx-translate/http-loader";
import {authInterceptor} from './auth/auth-interceptor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { provideSweetAlert2 } from "@sweetalert2/ngx-sweetalert2";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    }),
    provideAppInitializer(() => {
      const  translate = inject(TranslateService);
      translate.use(translate.getBrowserLang() || "en");
    }),
    importProvidersFrom(NgbModule),
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
  ]
};
