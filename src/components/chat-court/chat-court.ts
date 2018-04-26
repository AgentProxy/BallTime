import { Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ChatProvider } from '../../providers/chat/chat';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ChatCourtComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'chat-court',
  templateUrl: 'chat-court.html'
})
export class ChatCourtComponent {
  @Input() courtId: string;
  text: string;
  message: string = "";
  messages: any;
  userId: any;

  constructor(private db:AngularFirestore, private chatProvider:ChatProvider, private userProvider: UserProvider) {
    this.userId = this.userProvider.retrieveUserId();
    // setTimeout(this.loadMessages(),1000);
  }

  ionViewDidLoad(){
    // this.messages = this.chatProvider.retrieveMessages(this.courtId);
    setTimeout(this.loadMessages(),1000);
  }

  loadMessages(){
    // let court_id = this.courtId;
    // console.log(this.courtId);
  }

  sendMessage(){
    this.chatProvider.addCourtChat(this.courtId,this.message, this.userId);
    this.message = "";
    
  }

}
