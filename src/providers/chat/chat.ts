import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider {

  constructor(public http: HttpClient, private db: AngularFirestore) {
  }

  addCourtChat(courtId, message, sender){

    let chatMessage = {
      sender_id: sender.uid,
      sender_username: sender.username,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    }

    this.db.collection('courts/' + courtId + "/chat").add(chatMessage);
  }

  deleteCourtChat(courtId){
     this.db.collection('courts/' + courtId + "/chat").ref.get().then(
       snapshot => {
         snapshot.forEach(doc=>{
           doc.ref.delete();
         })
       }
     );

    // const batch = this.db.firestore.batch();

    // You can use the QuerySnapshot above like in the example i linke
  }

  // retrieveMessages(courtId){
  //   // alert(courtId);
  //   let messages = this.db.collection('courts').doc(courtId).collection("chat").ref.orderBy('timestamp','desc');
  //   return messages;
  // }

}
