import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HomePageModule } from '../pages/home/home.module';
import { LandingPageModule } from '../pages/landing/landing.module';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.services';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocationServiceProvider } from '../providers/location-service/location-service';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ProfilePage } from '../pages/profile/profile';
import { CourtProvider } from '../providers/court/court';
import { DiscoverPage } from '../pages/discover/discover';
import { FriendsPage } from '../pages/friends/friends';
import { CourtModalPage } from '../pages/court-modal/court-modal';
import { MessagesPage } from '../pages/messages/messages';




@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    DiscoverPage,
    FriendsPage,
    CourtModalPage,
    MessagesPage,
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    LandingPageModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,     //TO BE DELETED
    DiscoverPage,
    FriendsPage,
    CourtModalPage,
    MessagesPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    UserService,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationServiceProvider,
    Geolocation,
    BackgroundMode,
    CourtProvider,
    
  ]
})
export class AppModule {}
