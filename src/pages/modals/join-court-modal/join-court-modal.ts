import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models/user/user.model';


/**
 * Generated class for the JoinCourtModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-court-modal',
  templateUrl: 'join-court-modal.html',
})
export class JoinCourtModalPage {
  court: any;
  playersCount: any;
  players: any;
  showSpinner:boolean = true;
  playerId: string;
  userInfo: any;
  courtInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private courtProvider: CourtProvider, private viewCtrl: ViewController, private userProvider: UserProvider, private alertCtrl: AlertController ) {
    this.court = this.navParams.get('Court');
    this.courtInfo = this.courtProvider.retrieveCourtLive(this.court.id);
  }

  ngOnDestroy(){
    // this.courtProvider.removePlayer(this.userProvider.retrieveUserId(), this.court.id, this.court.players_count);
  }

  ionViewDidLoad() {
    this.courtProvider.addUserToCourt2(this.userProvider.retrieveUserInfo(),this.court.id, this.court.players_count);
    this.players = this.courtProvider.retrievePlayers(this.court.id);
    console.log('ionViewDidLoad JoinCourtModalPage');
  }

  ionViewWillEnter(){
    
  }
  ionViewDidEnter(){
    alert(this.court.players_count);
  }

  ionViewWillLeave(){
    this.courtProvider.removePlayer(this.userProvider.retrieveUserId(), this.court.id,this.court.players_count);
  }

  joinCourt(){
    //USE SUBSCRIBE TO STREAM DATA WITHOUT DISPLAYING IT TO FRONT END
    this.userInfo = this.userProvider.retrieveUserInfo().subscribe(action => {        
      let id = action.payload.id;
      let data = action.payload.data();
      return { id, ...data };
    });

    // this.playersCount.
   
    

  }

  leaveCourt(){
    // this.courtProvider.removePlayer(this.court.id);
    let confirm = this.alertCtrl.create({
      title: 'Leave Court',
      message: "Do you want to leave this court?",
      buttons: [
        {
          text: 'Leave',
          handler: () => {    
            // this.courtProvider.removePlayer(this.userProvider.retrieveUserId(), this.court.id);
            this.viewCtrl.dismiss();
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

  // async addPlayer(){
  //   this.playerId = await this.courtProvider.addUserToCourt(this.userProvider.retrieveUserObject(),this.court.id);
  //   alert(this.playerId);
  // }

  // addPlayer2(){
  
  // let player = this.courtProvider.addUserToCourt2(this.userProvider.retrieveUserInfo(),this.court.id);
  // alert(player.username);
  // }

}
