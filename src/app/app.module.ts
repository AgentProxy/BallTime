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
import { AngularFirestore } from 'angularfire2/firestore';
import { LocationServiceProvider } from '../providers/location-service/location-service';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from '@angular/common/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ProfilePage } from '../pages/profile/profile';
import { CourtProvider } from '../providers/court/court';
import { DiscoverPage } from '../pages/discover/discover';
import { FriendsPage } from '../pages/friends/friends';
import { CourtModalPage } from '../pages/modals/court-modal/court-modal';
import { MessagesPage } from '../pages/messages/messages';
import { MapModalPage } from '../pages/modals/map-modal/map-modal';
import { IonPullupModule } from 'ionic-pullup';
import { JoinCourtModalPage } from '../pages/modals/join-court-modal/join-court-modal';
import { UserProvider } from '../providers/user/user';
import { ComponentsModule } from '../components/components.module';
import { ProfileViewerModalPage } from '../pages/modals/profile-viewer-modal/profile-viewer-modal';
import { FriendsProvider } from '../providers/friends/friends';
import { ChatProvider } from '../providers/chat/chat';
import { DiscoverFriendsPage } from '../pages/discover-friends/discover-friends';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { HTTP } from '@ionic-native/http';
import { GamePage } from '../pages/game/game';
import 'rxjs/Rx'
import { WaitingPage } from '../pages/modals/waiting/waiting';
import { LocationProvider } from '../providers/location/location';
import { PopoverSettingsComponent } from '../components/popover-settings/popover-settings';



@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    DiscoverPage,
    FriendsPage,
    CourtModalPage,
    MessagesPage,
    // ProfileViewerModalComponent,
    MapModalPage,
    JoinCourtModalPage,
    ProfileViewerModalPage,
    DiscoverFriendsPage,
    GamePage,
    WaitingPage,
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    LandingPageModule,
    IonicModule.forRoot(MyApp ,{ mode: 'ios' }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    HttpClientModule,
    IonPullupModule,
    ComponentsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ProfilePage,     //TO BE DELETED
    DiscoverPage,
    FriendsPage,
    CourtModalPage,
    MessagesPage,
    MapModalPage,
    JoinCourtModalPage,
    ProfileViewerModalPage,
    DiscoverFriendsPage,
    GamePage,
    WaitingPage,
    PopoverSettingsComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFirestore,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocationServiceProvider,
    Geolocation,
    BackgroundMode,
    CourtProvider,
    UserProvider,
    FriendsProvider,
    ChatProvider,
    BackgroundGeolocation,
    HTTP,
    LocationProvider,
    
  ]
})
export class AppModule {}
