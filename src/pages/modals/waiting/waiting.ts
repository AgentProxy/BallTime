import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { AngularFirestore } from 'angularfire2/firestore';
import { JoinCourtModalPage } from '../join-court-modal/join-court-modal';

/**
 * Generated class for the WaitingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-waiting',
  templateUrl: 'waiting.html',
})
export class WaitingPage {

  court: any;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private alertCtrl: AlertController, private courtProvider : CourtProvider, private userProvider: UserProvider, private modalCtrl: ModalController) {
    this.userId = this.userProvider.retrieveUserID();
    this.court = navParams.get('Court');
    this.addToWaitlist();

    let subscription = this.courtProvider.retrieveWaitlistedUser(this.userId,this.court.id).subscribe(async () => {
      let status = await this.courtProvider.retrieveWaitlistedUserStatus(this.userId, this.court.id);
      if(status.status=='Accepted'){
        this.accepted();
        subscription.unsubscribe();
      }
      else if(status.status=='Rejected'){
        this.rejected();
        subscription.unsubscribe();
      }
      else{

      }
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaitingPage');
  }

  accepted(){
    this.courtProvider.removeUserFromWaitlist(this.userId, this.court.id);
    let data = {
      Role: 'Baller',
      Court: this.court,
    }
    this.navCtrl.push(JoinCourtModalPage, data);
  }
    
  
  addToWaitlist(){
    this.courtProvider.addUserToWaitlist(this.userProvider.retrieveUserInfo(), this.court.id);
  }

  cancelJoin(){
    let confirm = this.alertCtrl.create({
      title: "Cancel Join?", 
      message: "Do you really want to cancel joining this court ?",
      buttons: [
        {
          text: 'Yes',
          handler: () => {    
           this.navCtrl.setRoot('HomePage').then(()=>{
            this.navCtrl.popToRoot().then(()=>{
              this.removeFromWaitlist();
            });
           })
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

  removeFromWaitlist(){
    this.courtProvider.removeUserFromWaitlist(this.userProvider.retrieveUserID(), this.court.id)
  }

  rejected(){
    
    this.courtProvider.removeUserFromWaitlist(this.userId, this.court.id);
    this.navCtrl.setRoot('HomePage');
    this.navCtrl.popToRoot();
    let alertNotif = this.alertCtrl.create({
      title: 'Rejected!',
      subTitle: 'You have been rejected on joining the court the admin!',
      buttons: ['OK']
    });
    // this.courtProvider.removePlayer(this.userProvider.retrieveUserID(), this.court.id,this.court.players_count);
    alertNotif.present().then(()=>{
     
    });
  }

}
