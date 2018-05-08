import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user/user.model';
import { UserProvider } from '../../providers/user/user';
import { CourtProvider } from '../../providers/court/court';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile', 
  templateUrl: 'profile.html',
})



export class ProfilePage {
  // userInfo: Observable<User>;
  userId: any;
  userInfo: any;
  showLoading: boolean = true;
  role: any;
  courts:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider : UserProvider, private courtProvider: CourtProvider) {
    this.userId = this.userProvider.retrieveUserID();
  }

  async retrieveUserInfo(){
    this.role = await this.userProvider.retrieveRole(this.userId);
    if(this.role=='Administrator'){
      this.courts = await this.courtProvider.retrieveCourtsUnderAdmin(this.userId);
    }
    this.userInfo =  await this.userProvider.retrieveUserInfoLive(this.userId).map(action => {
      this.showLoading = false;
      let id = action.payload.id;
      let data = action.payload.data();
      this.showLoading = false;
      return { id, ...data };
    });
  }

  async retrieveRole(){
    this.role = await this.userProvider.retrieveRole(this.userId);
  }

  ionViewWillEnter() {
    
    this.retrieveUserInfo();

    
    console.log('ionViewDidLoad ProfilePage');
  }

}
