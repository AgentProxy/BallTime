import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home'; 
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { ProfilePage } from '../pages/profile/profile';
import { FriendsPage } from '../pages/friends/friends';
import { DiscoverPage } from '../pages/discover/discover';
import { BackgroundMode } from '@ionic-native/background-mode';
import { MessagesPage } from '../pages/messages/messages';
import { UserProvider } from '../providers/user/user';
import { Events } from 'ionic-angular';
import { HomeAdminPage } from '../pages/admin/home-admin/home-admin';
import { FriendsProvider } from '../providers/friends/friends';
import { ScreenOrientation } from '@ionic-native/screen-orientation';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:string = 'LandingPage';
  user:any;
  userId:string;
  showInfo:boolean = false;
  notifs:any;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private afAuth: AngularFireAuth, private alertCtrl: AlertController, private menuCtrl: MenuController,
     private backgroundMode: BackgroundMode, private userProvider: UserProvider, public events: Events, private friendsProvider: FriendsProvider, private screenOrientation: ScreenOrientation) {
    
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    
      
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // statusBar.overlaysWebView(true);
      // statusBar.backgroundColorByHexString('#333333');
      splashScreen.hide();
      this.backgroundMode.enable(); // Enable Running in Background Mode
    });

    events.subscribe('user:login', () => {
      this.getUserInfo();
    });
    
  }

  async getUserInfo(){
    // this.showInfo = true;
    this.user = await this.userProvider.retrieveUserObject(this.userProvider.retrieveUserID()); 
    this.showInfo = true;
    if(this.user.role=='Administrator'){
      this.pages = [
        { title: 'Home', component: HomeAdminPage },
        { title: 'Profile', component: ProfilePage},
        { title: 'Manage Courts', component: DiscoverPage},
        { title: 'Friends', component: FriendsPage},
      ];
    }
    else {
      this.getNotifs();
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Profile', component: ProfilePage},
        { title: 'Discover Courts', component: DiscoverPage},
        { title: 'Friends', component: FriendsPage}
      ];
    }
  }

  openPage(page){
    if(page.title == "Home"){
      if(this.nav.getActive().name=='HomePage'){
        return;
      }
      this.nav.setRoot(page.component);
    }
    else{
      this.nav.push(page.component);
    }
  }

  getNotifs(){
    this.notifs = this.friendsProvider.countNotifs(this.userProvider.retrieveUserID());
  }

  confirmLogout(){
    let confirm = this.alertCtrl.create({
      title: 'Confirm Log Out',
      message: "Are you sure you want to log out?",
      buttons: [
        {
          text: 'Log Out',
          handler: () => {
            this.logout();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
          }
        }
    ]
    });
    confirm.present();
  }

  logout(){
    this.afAuth.auth.signOut();
    this.menuCtrl.close();
    this.nav.setRoot('LandingPage');
  }
}

