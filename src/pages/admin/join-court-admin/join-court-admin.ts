import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, PopoverController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models/user/user.model';
import { ChatProvider } from '../../../providers/chat/chat';
import { PopoverSettingsComponent } from '../../../components/popover-settings/popover-settings';
import { ProfileViewerModalPage } from '../../modals/profile-viewer-modal/profile-viewer-modal';


/**
 * Generated class for the JoinCourtAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-join-court-admin',
  templateUrl: 'join-court-admin.html',
})
export class JoinCourtAdminPage {
  admin: any;
  court: any;
  courtStatus: String;
  message: String = ""; 
  messages: any;
  notifs: any;
  role: any;
  status: String;
  players: any;
  view: String = 'court';
  waitlisted: any;
  playersAllowed: any;
  playersCount: any;
  startTime: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private courtProvider: CourtProvider, private viewCtrl: ViewController, 
    private userProvider: UserProvider, private alertCtrl: AlertController, private chatProvider: ChatProvider, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
    this.status='';
    this.courtStatus='Online';
    this.court = this.navParams.get('Court');
    this.role = this.navParams.get('Role');
    this.messages = this.db.collection('courts/' + this.court.id + "/chat",ref => ref.orderBy('timestamp','asc')).valueChanges();
    this.notifs = this.courtProvider.retrieveWaitlisted(this.court.id);
    this.courtChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinCourtAdminPage');
  }

  async ionViewDidEnter(){
    this.status = '';
    this.courtStatus = 'Online';
    if(await this.adminExists()==false){
      this.courtProvider.addAdminToCourt(this.userProvider.retrieveUserObject(this.userProvider.retrieveUserID()),this.court.id);
    }
    else{
      let alertNotif = this.alertCtrl.create({
        title: 'Multiple Admins!',
        subTitle: 'There can only be one admin on each court!',
        buttons: ['OK']
      });
      alertNotif.present().then(()=>{
        this.viewCtrl.dismiss();
      });
    }
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

  acceptPlayer(userId){
    // this.courtProvider.addUserToCourt2(this.userProvider.retrieveUserInfo(),this.court.id, this.court.players_count);
    this.courtProvider.changePlayerStatus(userId, this.court.id, 'Accepted');
  }

  confirmPlayer(userId){
    this.courtProvider.updatePlayerStatus(userId, this.court.id, 'Confirmed');
  }

  changeCourtStatus(courtStatus){
    this.courtStatus = courtStatus;
  }

  async courtChanges(){
    this.db.doc('courts/'+this.court.id).valueChanges().subscribe(async x => {
      let courtObj =  await this.courtProvider.retrieveCourtObject(this.court.id);
      this.courtDetails(courtObj);
    })
  }

  courtDetails(courtObj){
    this.playersAllowed = (courtObj.players_allowed-2);
    this.playersCount = courtObj.players_count;
    this.startTime = courtObj.start_time;
    this.startTime = this.courtProvider.parseStartTime(this.startTime);
  }

  displayPopover(myEvent){
    let data = {
      courtId: this.court.id,
    }
    let popoover = this.popoverCtrl.create(PopoverSettingsComponent, data);
    popoover.present({
      ev: myEvent
    })
  }

  endGame(){
    let confirm = this.alertCtrl.create({
      title: 'End Game',
      message: "Do you want to end the game?",
      buttons: [
        {
          text: 'End',
          handler: () => {    
            this.courtProvider.endGame(this.court.id, this.role);
            this.courtProvider.changeCourtStatus(this.court.id,'Online');
            this.changeCourtStatus('Online');
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
            this.navCtrl.popToRoot().then(()=>{
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

  openProfile(userId){
    let data = {
      Id: userId,
    }
    
    let modal = this.modalCtrl.create(ProfileViewerModalPage, data);
    modal.present();
  }

  penalizePlayer(userId, username){
    let confirm = this.alertCtrl.create({
      title: 'Penalize' + " " + username,
      message: "Are you sure you want to penalize this player? (Only penalize players who are acting inappropriately)",
      buttons: [
        {
          text: 'Yes',
          handler: () => {    
            this.userProvider.penalizeUser(userId);
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
    // let limit = 1;            //THIS IS THE LIMIT FOR THE PLAYERS ON COURT
    let limit = this.playersAllowed; 
    //
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

  rejectPlayer(userId){
    this.courtProvider.changePlayerStatus(userId, this.court.id, 'Rejected');
  }

  retrieveAdmin(){
    this.admin = this.courtProvider.retrieveAdmin(this.court.id);
  }

  retrieveWaitlisted(){
    this.waitlisted = this.courtProvider.retrieveWaitlisted(this.court.id);
  }

  async startGame(){
    let data = {
      Role: 'Administrator',
      Court: this.court,
      Status: 'In Game',
    }
    let start = await this.courtProvider.checkPlayersInCourt(this.court.id, this.playersAllowed);
    if(start==true){
      this.courtProvider.changeCourtStatus(this.court.id,'In Game');
      this.changeCourtStatus('In Game');
      // this.courtProvider.startCourtGame(this.court.id);
      start=false;
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
    if(this.message.trim().length == 0){
      return false;
    }
    let userId = this.userProvider.retrieveUserID();
    let user = await this.userProvider.retrieveUserObject(userId);
    this.chatProvider.addCourtChat(this.court.id, this.message, user);
    this.message = "";
  }
}

