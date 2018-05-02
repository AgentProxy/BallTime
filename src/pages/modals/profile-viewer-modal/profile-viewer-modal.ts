import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { FriendsProvider } from '../../../providers/friends/friends';
import { AngularFirestore } from 'angularfire2/firestore';

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
  role:String = 'Baller';

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private viewCtrl: ViewController, 
    private friendsProvider: FriendsProvider, private alertCtrl: AlertController, private db: AngularFirestore) {
    this.userId = this.navParams.get('Id');
    this.friendsProvider.friendStatusChanges(this.userProvider.retrieveUserID(),this.navParams.get('Id')).subscribe(() => {
      this.checkStatus();
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileViewerModalPage');
  }

  ionViewWillEnter(){
    this.checkUserAndStatus();
    this.retrieveUserInfo();
  }

  async retrieveUserInfo(){
    this.userInfo = await this.userProvider.retrieveUserInfoLive(this.userId).map(action => {
      let id = action.payload.id;
      let data = action.payload.data();
      this.showLoading = false;
      return { id, ...data };
    });

    this.role = await this.userProvider.retrieveRole(this.userId);
  
  }

  checkUserAndStatus(){
    if(this.userId == this.userProvider.retrieveUserID()){
      this.sameUser = true;
    }
    else{
     this.checkStatus();
    }
  }

  async checkStatus(){
    let friendRequest = await this.friendsProvider.getStatus(this.userProvider.retrieveUserID(),this.navParams.get('Id'));
    this.status = friendRequest.status;
  }

  addFriend(){
    let sent = this.friendsProvider.addFriend(this.userProvider.retrieveUserID(),this.userId);
  }

  confirmFriend(){
    this.friendsProvider.confirmFriend(this.userProvider.retrieveUserID(),this.userId);
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
              this.friendsProvider.unfriend(this.userProvider.retrieveUserID(), this.userId);
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
              this.friendsProvider.unfriend(this.userProvider.retrieveUserID(), this.userId);
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
