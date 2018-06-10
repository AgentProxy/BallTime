import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../models/user/user.model';
import { ImagePicker } from '@ionic-native/image-picker';
import { storage } from 'firebase';

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
  // userInfo: any;
  new_password: any;
  confirm_password: any;
  showLoading: boolean = true;
  userId;
  username: String;
  userObj: any;

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
    games_played: 0,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private imgPicker: ImagePicker, private alertCtrl: AlertController) {
    this.userId = this.userProvider.retrieveUserID();
    this.retrieveUserInfo()
    this.retrieveRole();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  
  }

  editDone(){
    if(this.new_password!=''||this.confirm_password!=''){
      if(this.new_password!=this.confirm_password&&this.new_password.length<6){
        let alert = this.alertCtrl.create({
          title: 'Password',
          subTitle: "Passwords don't match or password is less than 6 characters",
          buttons: ['OK']
        });
        alert.present();
        return false;
      }
      else{
        var user = firebase.auth().currentUser;
        
        user.updatePassword(this.new_password).then(function() {
          // Update successful.
        }).catch(function(error) {
          // An error happened.
        });
      }

      // let alert = this.alertCtrl.create({
      //   title: 'Password',
      //   subTitle: "You're account details has been update",
      //   buttons: ['OK']
      // });
      // alert.present();
      // return false;
    }

    this.userProvider.updateUserProfile(this.userInfo, this.userId);
    let alert = this.alertCtrl.create({
      title: 'Account Updated',
      subTitle: "You're account details has been update",
      buttons: ['OK']
    });
    alert.present();
  }

  async retrieveUserInfo(){
    // this.role = await this.userProvider.retrieveRole(this.userId);
    // this.userInfo = this.userProvider.retrieveUserInfoValue(this.userId);
    this.userObj =  await this.userProvider.retrieveUserObject(this.userId);
    this.userInfo = this.userObj;
  }

  async retrieveRole(){
    this.role = await this.userProvider.retrieveRole(this.userId);
  }

  async uploadPP(){
    let options = {
      maximumImagesCount: 1,
    }
    console.log('ImagePicker');
    let image = await this.imgPicker.getPictures(options);
    let result = 'data:image/jpeg;base64,'+image;
    let pictures = storage().ref('pp/'+ this.userInfo.uid);
    pictures.putString(result);
  }

}
