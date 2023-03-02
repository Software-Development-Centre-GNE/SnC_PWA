// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';
// import { environment } from '../environments/environment';
// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireAuthModule } from '@angular/fire/compat/auth';
// import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';

// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';
// import { HttpClientModule } from '@angular/common/http';

// @NgModule({
//   declarations: [AppComponent],
// 	entryComponents: [],
// 	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, AngularFirestore,
// 		],
// 	bootstrap: [AppComponent],
// 	imports: [
// 		BrowserModule,
// 		AngularFireModule.initializeApp(environment.firebase),
// 		AngularFireAuthModule,
// 		AngularFireMessagingModule,
// 		AngularFireStorageModule,
// 		IonicModule.forRoot(), AppRoutingModule, HttpClientModule
// 	  ]
// })

// export class AppModule {}
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// Firebase + environment
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase as any),
    AngularFirestoreModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}