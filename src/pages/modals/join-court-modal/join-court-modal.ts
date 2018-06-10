import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController, PopoverController } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { User } from '../../../models/user/user.model';
import { ChatProvider } from '../../../providers/chat/chat';
import { MapModalPage } from '../map-modal/map-modal';
import { GamePage } from '../../game/game';
import { PopoverSettingsComponent } from '../../../components/popover-settings/popover-settings';
import { ProfileViewerModalPage } from '../profile-viewer-modal/profile-viewer-modal';


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
  notifs: any;
  role: any;
  status: String;
  players: any;
  view: String = 'court';
  waitlisted: any;
  playersAllowed: any;
  playersCount: any;
  startTime: any;
  // showSpinner:boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore, private courtProvider: CourtProvider, private viewCtrl: ViewController, 
    private userProvider: UserProvider, private alertCtrl: AlertController, private chatProvider: ChatProvider, private modalCtrl: ModalController, private popoverCtrl: PopoverController) {
    this.status='';
    this.courtStatus='Online';
    this.court = this.navParams.get('Court');
    this.role = this.navParams.get('Role');
    this.messages = this.db.collection('courts/' + this.court.id + "/chat",ref => ref.orderBy('timestamp','asc')).valueChanges();
    this.notifs = this.courtProvider.retrieveWaitlisted(this.court.id);
    this.courtChanges();


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
      else if(court.status == 'Offline'){
        let alertNotif = this.alertCtrl.create({
          title: 'The court is offline',
          subTitle: 'The court is offline! Please try again later',
          buttons: ['OK']
        });
        alertNotif.present().then(()=>{
          this.navCtrl.popToRoot();
        });
      }
      else{}

      let subscription = this.courtProvider.retrievePlayerSnapshot(this.userProvider.retrieveUserID(), this.court.id).subscribe(async ()=>{
        let player = await this.courtProvider.retrievePlayerStatus(this.userProvider.retrieveUserID(), this.court.id);
        if(player.status=='Kicked' && this.status!='Kicked'){
          this.status='Kicked';
          let alertNotif = this.alertCtrl.create({
            title: 'Kicked!',
            subTitle: 'You have been kicked by the admin!',
            buttons: ['OK']
          });
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
    this.courtStatus = 'Online';

    // if(this.role=='Baller'){
    //   this.courtProvider.addUserToCourt2(this.userProvider.retrieveUserInfo(),this.court.id, this.playersCount);
    // }
    // else{}
    this.retrieveAdmin();
    this.players = this.courtProvider.retrievePlayers(this.court.id);
  }

  acceptPlayer(userId){
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

  leaveCourt(){
    let confirm = this.alertCtrl.create({
      title: 'Leave Court',
      message: "Do you want to leave this court?",
      buttons: [
        {
          text: 'Leave',
          handler: () => {  
            if(this.role=="Baller"){
              this.courtProvider.removePlayer(this.userProvider.retrieveUserID(), this.court.id,this.court.players_count);
            }  
          
            this.navCtrl.popToRoot().then(()=>{
             
              // else{}
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

  readyPlayer(){
    this.status = 'Ready';
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Ready');
  }

  retrieveAdmin(){
    this.admin = this.courtProvider.retrieveAdmin(this.court.id);
  }

  retrieveWaitlisted(){
    this.waitlisted = this.courtProvider.retrieveWaitlisted(this.court.id);
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
}
