import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user/user.model';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  userInfo: User = {
    uid: undefined,
    username: "",
    firstname: "",
    lastname: "",
    middle_initial: "",
    age: undefined,
    height: "",
    weight: undefined,
    profile_pic: "",
    registered: true,
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  addUser(userInfo: User){
    userInfo.registered = true;
    this.userProvider.addUserInfo(userInfo);
    this.navCtrl.setRoot('HomePage');               //should put try catch for errors
    
  }

}
