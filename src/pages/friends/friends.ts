import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { User } from '../../models/user/user.model';
import { Observable } from '@firebase/util';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { UserProvider } from '../../providers/user/user';
import { ProfileViewerModalPage } from '../../pages/modals/profile-viewer-modal/profile-viewer-modal';
import { FriendsProvider } from '../../providers/friends/friends';
 
/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {
  users: any;
  filteredUsers = [];
  allUsers = [];
  showSpinner: boolean = true;
  searchInput: string;
  userId: any;
  friends: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private friendProvider: FriendsProvider, private userProvider: UserProvider, private modalCtrl: ModalController) {
    this.initializeUsers();
    this.userId = this.userProvider.retrieveUserId()
  }

  ionViewDidLoad() {
    
  }

  initializeUsers(){
    this.friends = this.userProvider.retrieveUsers().snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return { id, ...data };
      }); 
    });

    this.friends.subscribe(snapshots=>{
      snapshots.forEach(user => {
        this.showSpinner = false;
        // user.payload.data().
        alert(user.username)
        this.allUsers.push(user);
      });
    });

    this.filteredUsers = this.allUsers;
    
  }

  searchUsers(ev: any){
    this.showSpinner = true;

    if (!this.searchInput) {
      this.filteredUsers = this.allUsers;
      this.showSpinner = false;
      return;
    }

    if (this.searchInput && this.searchInput.trim() != '') {
      this.filteredUsers = this.filteredUsers.filter((user) => {
        this.showSpinner = false;
        return (user.username.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1);
      })
    }

  }

  openProfile(user){
    let data = {
      Id: user.id,
    }
    
    let modal = this.modalCtrl.create(ProfileViewerModalPage, data);
    modal.present();
  }

}
