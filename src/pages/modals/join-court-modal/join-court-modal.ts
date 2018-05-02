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
  court: any;
  playersCount: any;
  players: any;
  showSpinner:boolean = true;
  playerId: string;
  userInfo: any;
  courtInfo: any;
  messages: any;
  message: string = ""; 
  role: any;
  admin: any;
  adminInside: boolean = false;
  ready: boolean = false;
  status: string = '';
  courtReady: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private courtProvider: CourtProvider, private viewCtrl: ViewController, private userProvider: UserProvider, private alertCtrl: AlertController, private chatProvider: ChatProvider, private modalCtrl: ModalController ) {
    this.court = this.navParams.get('Court');
    this.courtInfo = this.courtProvider.retrieveCourtLive(this.court.id);
    this.messages = this.db.collection('courts/' + this.court.id + "/chat",ref => ref.orderBy('timestamp','asc').limit(20)).valueChanges();
    this.role = this.navParams.get('Role');
    this.courtProvider.retrieveCourtSnapshot(this.court.id).subscribe(async ()=>{
      let court = await this.courtProvider.courtStatusChanges(this.court.id);
      if(court.status == 'Waiting' && this.role =='Baller' && this.status=='Ready'){
        this.status="Coming";
        let data = {
          Role: 'Baller',
          Court: this.court,
          Status: 'Coming',
        }
        let modal = this.modalCtrl.create(GamePage,data);
        modal.present();
        this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(),this.court.id,'Coming');
      }
    })
  }

  async ionViewDidLoad() {
    if (this.role=='Administrator'){
        if(await this.adminExists()==false){
          this.courtProvider.addAdminToCourt(this.userProvider.retrieveUserObject(this.userProvider.retrieveUserID()),this.court.id);
          this.adminInside = true;
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Multiple Admins!',
            subTitle: 'There can be only one admin on each court!',
            buttons: ['OK']
          });
          alert.present().then(()=>{
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

  ionViewWillLeave(){
   
  }

  checkCourtStatus(){
    
    this.courtProvider.courtStatusChanges(this.court.id);
  }

  joinCourt(){
    //USE SUBSCRIBE TO STREAM DATA WITHOUT DISPLAYING IT TO FRONT END
    this.userInfo = this.userProvider.retrieveUserInfo().subscribe(action => {        
      let id = action.payload.id;
      let data = action.payload.data();
      return { id, ...data };
    });
  }

  leaveCourt(){
    let confirm = this.alertCtrl.create({
      title: 'Leave Court',
      message: "Do you want to leave this court?",
      buttons: [
        {
          text: 'Leave',
          handler: () => {    
            this.viewCtrl.dismiss().then(()=>{
              alert('leaving');
              if(this.role=="Baller"){
                this.courtProvider.removePlayer(this.userProvider.retrieveUserID(), this.court.id,this.court.players_count);
              }
              else if(this.role=='Administrator' && this.adminInside==true){
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
  
  showDirection(courtInfo){  
    let data = {
      Court: courtInfo,
      Page: 'join',
    }
    let modal = this.modalCtrl.create(MapModalPage, data);
    modal.present();
  }

  async sendMessage(){
    let userId = this.userProvider.retrieveUserID();
    let user = await this.userProvider.retrieveUserObject(userId);
    this.chatProvider.addCourtChat(this.court.id,this.message, user);
    this.message = "";
  }

  retrieveAdmin(){
    this.admin = this.courtProvider.retrieveAdmin(this.court.id);
  }

  async adminExists(){
    let adminId = await this.courtProvider.currentAdminExists(this.court.id);
    adminId = await this.courtProvider.currentAdminExists(this.court.id);
    if(adminId == ""){
      return false;
    }
    else{
      return true;
    }
  }

  changeCourtStatus(){
    this.courtReady = true;
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
              this.changeCourtStatus();
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
      // let data = {
      //   Role: 'Administrator',
      //   Court: this.court,
      // }
      // this.navCtrl.push(GamePage, data);
      //change court status to waiting
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Players are not ready!',
        subTitle: 'Wait for the players to be ready!',
        buttons: ['OK']
      });
      alert.present().then(()=>{
      });
    }  
  }

 



  readyPlayer(){
    this.ready = true;
    this.status = 'Ready';
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Ready');
  }

  async startGame(){
    let data = {
      Role: 'Administrator',
      Court: this.court,
      Status: 'In Game',
    }
    let start = await this.courtProvider.checkPlayersInCourt(this.court.id);
    if(start==true){
      let modal = this.modalCtrl.create(GamePage,data);
      modal.present();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Players Not Complete!',
        subTitle: 'All players are not yet complete!',
        buttons: ['OK']
      });
      alert.present();
    }
   

    //FOR ALL PLAYERS CHANGE STATUS TO IN GAME
    //check if all players are confirmed: count == limit 
    //if yes set set all their status to in game
    //push game modal for admin 
    //if not return an alert
    //

    // this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(),this.court.id,'In Game');
  }

  async unreadyCourt(){
  
    // let wait = await this.courtProvider.readyCourt(this.court.id, limit);
  
  }

  unreadyPlayer(){
    this.ready = false;
    this.status = '';
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, '');
  }


  confirmPlayer(userId){
    this.courtProvider.updatePlayerStatus(userId, this.court.id, 'Confirmed');
    //change player status to confirmed
    //all players will have waiting for other players to arrive
    //if all players have arrived and are confirmed
    //start game
    //change court status to in game
    //change all players status to in game
    //admin will be navigated to game page
    //players will be changed to 'In game' status and ball bouncing animation
  }
 

}
