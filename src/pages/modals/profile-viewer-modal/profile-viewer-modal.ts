import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { FriendsProvider } from '../../../providers/friends/friends';

/**
 * Generated class for the ProfileViewerModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-viewer-modal',
  templateUrl: 'profile-viewer-modal.html',
})
export class ProfileViewerModalPage {

  userInfo:any;
  userId: any;
  showLoading:any;
  user:any;
  sameUser: boolean = false;
  status: String = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private viewCtrl: ViewController, 
    private friendsProvider: FriendsProvider, private alertCtrl: AlertController) {
    this.userId = this.navParams.get('Id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileViewerModalPage');
  }

  ionViewWillEnter(){
    this.checkUserAndStatus();
    this.retrieveUserInfo();
  }

  retrieveUserInfo(){
    this.userInfo =  this.userProvider.retrieveUserInfoLive(this.userId).map(action => {
      let id = action.payload.id;
      let data = action.payload.data();
      this.showLoading = false;
      return { id, ...data };
    });
  }

  checkUserAndStatus(){
    if(this.userId == this.userProvider.retrieveUserId()){
      this.sameUser = true;
    }
    else{
     this.checkStatus();
    }
  }

  async checkStatus(){
    let friendRequest = await this.friendsProvider.getStatus(this.userProvider.retrieveUserId(),this.userId);
    this.status = friendRequest.status;
    // this.userId = friendRequest.userId;
    alert(this.status);
  }

  addFriend(){
    // alert(this.navParams.get('Id'));
    let sent = this.friendsProvider.addFriend(this.userProvider.retrieveUserId(),this.navParams.get('Id'));
    if(sent==true){
      this.checkStatus();
    }
  }

  confirmFriend(){
    this.friendsProvider.confirmFriend(this.userProvider.retrieveUserId(),this.navParams.get('Id'));
    this.checkStatus();
  }

  async cancelRequest(){
    alert(this.status);
    if(this.status=='Pending'){
      let confirm = this.alertCtrl.create({
        title: 'Cancel Friend Request',
        message: "Do you want to cancel the friend request?",
        buttons: [
          {
            text: 'Yes',
            handler: () => {    
              this.friendsProvider.unfriend(this.userProvider.retrieveUserId(), this.userId);
              this.checkStatus();
            }
          },
          {
            text: 'No',
            handler: () => {
            }
          }
      ]
      });
      confirm.present();
    }
    else if (this.status=='Friends'){
      let confirm = this.alertCtrl.create({
        title: 'Unfriend',
        message: "Do you want to unfriend this user?",
        buttons: [
          {
            text: 'Yes',
            handler: () => {    
              this.friendsProvider.unfriend(this.userProvider.retrieveUserId(), this.userId);
              this.checkStatus();
            }
          },
          {
            text: 'No',
            handler: () => {
            }
          }
      ]
      });
      confirm.present();
    }
    else{

    }
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
