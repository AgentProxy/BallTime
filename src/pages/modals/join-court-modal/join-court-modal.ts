import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models/user/user.model';
import { ChatProvider } from '../../../providers/chat/chat';
import { MapModalPage } from '../map-modal/map-modal';
import { GamePage } from '../../game/game';


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
  admin: any;
  court: any;
  courtStatus: String;
  message: String = ""; 
  messages: any;
  role: any;
  status: String;
  players: any;
  // showSpinner:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private courtProvider: CourtProvider, private viewCtrl: ViewController, private userProvider: UserProvider, private alertCtrl: AlertController, private chatProvider: ChatProvider, private modalCtrl: ModalController ) {
    this.status='';
    this.courtStatus='';
    this.court = this.navParams.get('Court');
    this.role = this.navParams.get('Role');
    this.messages = this.db.collection('courts/' + this.court.id + "/chat",ref => ref.orderBy('timestamp','asc').limit(20)).valueChanges();
    
    this.courtProvider.retrieveCourtSnapshot(this.court.id).subscribe(async ()=>{
      let court = await this.courtProvider.courtStatusChanges(this.court.id);
      this.changeCourtStatus(court.status);
      if(court.status == 'Waiting' && this.role =='Baller' && this.status=='Ready'){
        let data = {
          Role: 'Baller',
          Court: this.court,
          Status: 'Coming',
        }
        this.status='Coming';
        this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(),this.court.id,'Coming');
        let modal = this.modalCtrl.create(GamePage,data);
        modal.present();
      }
      // else if(court.status == '' && this.status=='Coming'){
      //   this.status='';
      // }
      let subscription = this.courtProvider.retrievePlayerSnapshot(this.userProvider.retrieveUserID(), this.court.id).subscribe(async ()=>{
        let player = await this.courtProvider.retrievePlayerStatus(this.userProvider.retrieveUserID(), this.court.id);
        if(player.status=='Kicked' && this.status!='Kicked'){
          this.status='Kicked';
          let alertNotif = this.alertCtrl.create({
            title: 'Kicked!',
            subTitle: 'You have been kicked by the admin!',
            buttons: ['OK']
          });
          this.courtProvider.removePlayer(this.userProvider.retrieveUserID(), this.court.id,this.court.players_count);
          alertNotif.present().then(()=>{
            
            this.navCtrl.popToRoot();
          });
        }
        else{}
      });

    })
  }

  async ionViewDidEnter() {
    this.status = '';
    this.courtStatus = '';
    // this.court.status = ''
    if (this.role=='Administrator'){
        if(await this.adminExists()==false){
          this.courtProvider.addAdminToCourt(this.userProvider.retrieveUserObject(this.userProvider.retrieveUserID()),this.court.id);
        }
        else{
          let alertNotif = this.alertCtrl.create({
            title: 'Multiple Admins!',
            subTitle: 'There can be only one admin on each court!',
            buttons: ['OK']
          });
          alertNotif.present().then(()=>{
            this.viewCtrl.dismiss();
          });
        }
    }
    else if(this.role=='Baller'){
      this.courtProvider.addUserToCourt2(this.userProvider.retrieveUserInfo(),this.court.id, this.court.players_count);
    }
    else{}

    this.retrieveAdmin();
    this.players = this.courtProvider.retrievePlayers(this.court.id);
  }

  async adminExists(){
    let adminId = await this.courtProvider.currentAdminExists(this.court.id);
    if(adminId == ""){
      return false;
    }
    else{
      return true;
    }
  }

  confirmPlayer(userId){
    this.courtProvider.updatePlayerStatus(userId, this.court.id, 'Confirmed');
  }

  changeCourtStatus(courtStatus){
    this.courtStatus = courtStatus;
  }

  kickPlayer(playerId, playerUsername){
    let confirm = this.alertCtrl.create({
      title: 'Kick ' + playerUsername +'?', 
      message: "Do you really want to kick " + playerUsername + '?',
      buttons: [
        {
          text: 'Kick',
          handler: () => {    
            this.courtProvider.kickPlayer(playerId, this.court.id);
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
  
  };

  leaveCourt(){
    let confirm = this.alertCtrl.create({
      title: 'Leave Court',
      message: "Do you want to leave this court?",
      buttons: [
        {
          text: 'Leave',
          handler: () => {    
            this.viewCtrl.dismiss().then(()=>{
              if(this.role=="Baller"){
                this.courtProvider.removePlayer(this.userProvider.retrieveUserID(), this.court.id,this.court.players_count);
              }
              else if(this.role=='Administrator'){
                this.courtProvider.removeAdminFromCourt(this.court.id, this.userProvider.retrieveUserID());
              }
              else{}
            });
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

  async readyCourt(){
    let limit = 1;            //THIS IS THE LIMIT FOR THE PLAYERS ON COURT
    let wait = await this.courtProvider.readyCourt(this.court.id, limit);
    if(wait==true){
      let confirm = this.alertCtrl.create({
        title: 'Ready Court',
        message: "Are you sure that the court is ready?",
        buttons: [
          {
            text: 'Yes',
            handler: () => {    
              this.changeCourtStatus('Waiting');
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
    else{
      let alertNotif = this.alertCtrl.create({
        title: 'Players are not ready!',
        subTitle: 'Wait for the players to be ready!',
        buttons: ['OK']
      });
      alertNotif.present().then(()=>{
      });
    }  
  }

  readyPlayer(){
    this.status = 'Ready';
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Ready');
  }

  retrieveAdmin(){
    this.admin = this.courtProvider.retrieveAdmin(this.court.id);
  }

  async startGame(){
    let data = {
      Role: 'Administrator',
      Court: this.court,
      Status: 'In Game',
    }
    let start = await this.courtProvider.checkPlayersInCourt(this.court.id);
    if(start==true){
      this.courtProvider.changeCourtStatus(this.court.id,'In Game');
      // this.courtProvider.startCourtGame(this.court.id);
      start=false;
      let modal = this.modalCtrl.create(GamePage,data);
      modal.present();
     
    }
    else{
      let alertNotif = this.alertCtrl.create({
        title: 'Players Not Complete!',
        subTitle: 'All players are not yet complete!',
        buttons: ['OK']
      });
      alertNotif.present();
    }
  }

  async sendMessage(){
    let userId = this.userProvider.retrieveUserID();
    let user = await this.userProvider.retrieveUserObject(userId);
    this.chatProvider.addCourtChat(this.court.id, this.message, user);
    this.message = "";
  }

  showDirection(courtInfo){  
    let data = {
      Court: courtInfo,
      Page: 'join',
    }
    let modal = this.modalCtrl.create(MapModalPage, data);
    modal.present();
  }

  unreadyPlayer(){
    this.status = '';
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, '');
  }

  // async unreadyCourt(){
  
  //   // let wait = await this.courtProvider.readyCourt(this.court.id, limit);
  
  // }

 

}
