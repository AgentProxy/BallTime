import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { FriendsProvider } from '../../../providers/friends/friends';
import { AngularFirestore } from 'angularfire2/firestore';
import { CourtProvider } from '../../../providers/court/court';
import { FriendsPage } from '../../friends/friends';

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
  role: any;
  courts: any = [];
  viewerRole: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private viewCtrl: ViewController, 
    private friendsProvider: FriendsProvider, private alertCtrl: AlertController, private db: AngularFirestore, private courtProvider: CourtProvider,
    private modalCtrl: ModalController) {
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
    this.viewerRole = await this.userProvider.retrieveRole(this.userProvider.retrieveUserID());
    this.role = await this.userProvider.retrieveRole(this.userId);
    if(this.role=='Administrator'){
      this.courts = await this.courtProvider.retrieveCourtsUnderAdmin(this.userId);
    }
    this.userInfo = await this.userProvider.retrieveUserInfoLive(this.userId).map(action => {
      let id = action.payload.id;
      let data = action.payload.data();
      this.showLoading = false;
      return { id, ...data };
    });

    // this.role = this.userInfo.data.role;
  
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

  penalizeUser( username){
    let confirm = this.alertCtrl.create({
      title: 'Penalize',
      message: "Are you sure you want to penalize this player? (Only penalize players who are acting inappropriately)",
      buttons: [
        {
          text: 'Yes',
          handler: () => {    
            this.userProvider.penalizeUser(this.userId);
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

  showFriends(){
    let data = {
      userId: this.userId,
      use: 'Modal',
    }

    let modal = this.modalCtrl.create(FriendsPage, data);
    modal.present();
  }

}
