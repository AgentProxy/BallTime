import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../services/user.services';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user/user.model';
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
  userInfo: Observable<User>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService : UserService) {
    // this.userInfo = this.retrieveUserInfo();
  }

  retrieveUserInfo(){
    return this.userService.retrieveUserInfo();
  }

  ionViewWillEnter() {
    this.userInfo = this.retrieveUserInfo();
    console.log('ionViewDidLoad ProfilePage');
  }

}
