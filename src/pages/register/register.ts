import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
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
  @ViewChild(Slides) slides: Slides;
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
    role: 'baller',
    latitude: '',
    longitude: '',
    penalty: 0,
    reputation_points: 0,
    reputation_level: 0,
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

  nextSlide(){
    this.slides.slideNext();
  }

  prevSlide(){
    this.slides.slidePrev();
  }

}
