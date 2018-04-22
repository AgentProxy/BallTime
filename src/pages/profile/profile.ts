import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user/user.model';
import { UserProvider } from '../../providers/user/user';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider : UserProvider) {
    this.userId = this.userProvider.retrieveUserId();
  }

  retrieveUserInfo(){
    this.userInfo =  this.userProvider.retrieveUserInfoLive(this.userId).map(action => {
      let id = action.payload.id;
      let data = action.payload.data();
      this.showLoading = false;
      return { id, ...data };
    });
  }

  ionViewWillEnter() {
    this.retrieveUserInfo();
    console.log('ionViewDidLoad ProfilePage');
  }

}
