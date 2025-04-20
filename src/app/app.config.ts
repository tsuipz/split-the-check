import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer, AuthEffects } from './core/stores/auth';
import { groupsReducer, GroupsEffects } from './core/stores/groups';
import { paymentsReducer, PaymentsEffects } from './core/stores/payments';

const REDUCERS = {
  auth: authReducer,
  groups: groupsReducer,
  router: routerReducer,
  payments: paymentsReducer,
};

const EFFECTS = [AuthEffects, GroupsEffects, PaymentsEffects];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideAnimationsAsync(),
    provideStore(REDUCERS),
    provideEffects(EFFECTS),
    provideRouterStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
