import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { FriendsProvider } from '../../providers/friends/friends';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerModalPage } from '../modals/profile-viewer-modal/profile-viewer-modal';

/**
 * Generated class for the DiscoverFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover-friends',
  templateUrl: 'discover-friends.html',
})
export class DiscoverFriendsPage {
  users: any;
  filteredUsers = [];
  allUsers = [];
  showSpinner: boolean = true;
  searchInput: string;
  userId: any;
  friends: any;
  showList:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private friendProvider: FriendsProvider, private userProvider: UserProvider, private modalCtrl: ModalController) {
    this.userId = this.userProvider.retrieveUserID();
    // this.users = this.userProvider.retrieveUsers();
    this.initializeUsers();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverFriendsPage');
  }

  async initializeUsers(){
    this.users = this.userProvider.retrieveUsers().map(actions => {
      // this.showSpinner = false;
      return actions.map(user => {
        const data = user.payload.doc.data();
        const id = user.payload.doc.id;
        return { id, ...data };
      }); 
     
    });
    this.users.subscribe(snapshots=>{
      snapshots.forEach(user => {
        this.allUsers.push(user);
      });
    });

    this.filteredUsers = this.allUsers;
  }

  searchUsers(ev: any){
    this.showSpinner = true;
    this.filteredUsers = this.allUsers;
    if (!this.searchInput) {
      this.showList = false;
      this.showSpinner = false;
      return;
    }

    if (this.searchInput && this.searchInput.trim() != '') {
      this.showList = true;
      this.filteredUsers = this.filteredUsers.filter((user) => {
        this.showSpinner = false;
        return (user.username.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
      });
    }

  }

  openProfile(user){
    let data = {
      Id: user.id,
    }
    let modal = this.modalCtrl.create(ProfileViewerModalPage, data);
    modal.present();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
