import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../models/user/user.model';

/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  role: any;
  userInfo: any;
  showLoading: boolean = true;
  userId;
  username: String;

  user: User = {
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
    role: 'baller',
    latitude: '',
    longitude: '',
    penalty: 0,
    reputation_points: 0,
    reputation_level: 0,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider) {
    this.userId = this.userProvider.retrieveUserID();
    this.retrieveRole();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  async retrieveUserInfo(){
    this.role = await this.userProvider.retrieveRole(this.userId);

    this.userInfo =  await this.userProvider.retrieveUserObject(this.userId);
    this.username = this.userInfo.username;
  }

  async retrieveRole(){
    this.role = await this.userProvider.retrieveRole(this.userId);
  }

}
