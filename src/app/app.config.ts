import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-152c5","appId":"1:66433306016:web:040aff0bb847ba3c9568c5","storageBucket":"danotes-152c5.firebasestorage.app","apiKey":"AIzaSyCRF4KmtmtmA0uE5jD6VUpzs34IXxbN8ww","authDomain":"danotes-152c5.firebaseapp.com","messagingSenderId":"66433306016"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
