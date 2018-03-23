import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user/user.model';
import { UserService } from '../../services/user.services';
import { Observable } from '@firebase/util';
 
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
  filteredUsers: any;
  sampleArray = [];
  // private shirtCollection: AngularFirestoreCollection<Shirt>;
  // shirts: Observable<ShirtId[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
  
  }

  ionViewDidLoad() {
    this.filteredUsers = this.userService.retrieveUsers();
    console.log('ionViewDidLoad FriendsPage');
    this.users = this.filteredUsers.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        this.sampleArray.push(data);
        return { id, ...data };
      }); 
    });
    
    setTimeout(() => {
      alert(this.sampleArray);
    } ,3000)
  }

}
