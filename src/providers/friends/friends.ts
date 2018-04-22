import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { AngularFirestore } from 'angularfire2/firestore';

/*
  Generated class for the FriendsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FriendsProvider {
  friendsCollection: any;
    
  constructor(public http: HttpClient, private userProvider: UserProvider, private db: AngularFirestore) {
    this.friendsCollection = this.db.collection('friends');
  }

  addFriend(userId1,userId2){
    let senderData = {
      receiver: userId2,
      status: 'Pending',
    }
    let receiverData = {
      sender: userId1,
      status: 'Accept Request'
    }
    this.db.doc('users/' + userId1 + '/friends/' + userId2).set(senderData);
    this.db.doc('users/' + userId2 + '/friends/' + userId1).set(receiverData);
    return true;
  }

  confirmFriend(userId1,userId2){
    this.db.doc('users/' + userId1 + '/friends/' + userId2).update({status: 'Friends'});
    this.db.doc('users/' + userId2 + '/friends/' + userId1).update({status: 'Friends'});
    return true;
  }

  // this.db.collect('friends', ref => ref.where(this.userProvider.retrieveUserId(), '==', 'user')

  getStatus(userId1,userId2){
    let status = '';
    let userId = '';
    
    let query = this.db.doc('users/' + userId1 + '/friends/' + userId2).ref.get().then((docSnapshot) => {
      if (docSnapshot.exists){
        status = docSnapshot.data().status;
      } 
      else{
      }
      return {status, userId};
    });
    return query;
  }

  unfriend(userId1,userId2){
    this.db.doc('users/' + userId1 + '/friends/' + userId2).delete();
    this.db.doc('users/' + userId2 + '/friends/' + userId1).delete();
  }

}
