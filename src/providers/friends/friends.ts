import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { timestamp } from 'rxjs/operators';
// import { Observable } from 'rxjs/Rx';

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

  // retrieveFriends(userId){
  //   let friends = this.db.collection('users').doc(userId).collection('friends').snapshotChanges();
  //   return friends;
  // }

  async addFriend(userId1,userId2){
    let senderData = {
      user_id: userId2,
      status: 'Pending',
    }
    let receiverData = {
      user_id: userId1,
      status: 'Accept Request'
    }
    this.db.doc('users/' + userId1 + '/friends/' + userId2).set(senderData);
    this.db.doc('users/' + userId2 + '/friends/' + userId1).set(receiverData);
    
    let username_sender = await this.userProvider.retrieveUserObject(userId1);
    let notif = {
      from_userId: userId1,
      message: username_sender.username + ' has sent you a friend request',
      seen: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      to_userId: userId2,
    }
    this.db.collection('notifications').add(notif);
    return true;
  }

  async confirmFriend(userId1,userId2){
    this.db.doc('users/' + userId1 + '/friends/' + userId2).update({status: 'Friends'});
    this.db.doc('users/' + userId2 + '/friends/' + userId1).update({status: 'Friends'});
    let username_receiver = await this.userProvider.retrieveUserObject(userId1);
    let notif = {
      from_userId: userId1,
      message: username_receiver.username + ' has accepted your friend request',
      seen: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      to_userId: userId2,
    }
    this.db.collection('notifications').add(notif);
    return true;
  }

  countNotifs(userId){
    let notifs = this.db.collection('notifications', ref => ref.where('to_userId','==',userId).where('seen', '==', false)).valueChanges();
    return notifs;
  }

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

  friendStatusChanges(userId1,userId2){
      return this.db.doc('users/' + userId1 + '/friends/' + userId2).snapshotChanges();
  }

  getFriends(userId){
    let friends = this.db.collection('users/' + userId + '/friends', ref => ref.where('status', '==', 'Friends'));
    return friends.snapshotChanges();
  }

  getNotifs(userId){
    let notifsArray = [];

    let notifs = this.db.collection('notifications', ref => ref.where('to_userId','==',userId).orderBy('timestamp', 'desc')).snapshotChanges().map(actions => {
      return actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();   
        this.db.collection('notifications').doc(id).set({seen: true}, {merge: true}); 
        return { id,...data };
      }); 
    });


    return notifs;
    // notifs.subscribe(notifs => {
    //     notifsArray = notifs;
    // });
    // notifsArray.
  }

  unfriend(userId1,userId2){
    this.db.doc('users/' + userId1 + '/friends/' + userId2).delete();
    this.db.doc('users/' + userId2 + '/friends/' + userId1).delete();
  }

}
