import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, AlertController } from 'ionic-angular';
import { CourtProvider } from '../../providers/court/court';
import { UserProvider } from '../../providers/user/user';
import { MapModalPage } from '../modals/map-modal/map-modal';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  role: any;
  status: any;
  court: any;
  confirmed:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, 
    private userProvider: UserProvider, private modalCtrl: ModalController, private viewCtrl: ViewController,
    private alertCtrl: AlertController, private afAuth: AngularFireAuth) {

    this.role = this.navParams.get('Role');
    this.status = this.navParams.get('Status');
    this.court = this.navParams.get('Court');

    alert(this.status);
    if(this.role == 'Baller'){
      this.courtProvider.retrieveCourtSnapshot(this.court.id).subscribe(async ()=>{
        let court = await this.courtProvider.courtStatusChanges(this.court.id);
        if(court.status == 'In Game' && this.role =='Baller' && this.status=='Confirmed'){
          this.status='In Game';
          this.courtProvider.changePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, status);
        }
        else if(court.status == 'Online' && this.role=='Baller' && this.status=='In Game'){
          this.status='';
          let alert = this.alertCtrl.create({
            title: 'Game Has Ended!',
            subTitle: 'Great game ballers! You earned 150 Reputation Points',
            buttons: ['OK']
          });
          alert.present().then(()=>{
            if(this.role=='Baller'){
              this.courtProvider.rewardPlayers(this.userProvider.retrieveUserID());
            }
            this.navCtrl.popToRoot();
          });
          //ADD TO PLAYERS' RECORD IF GAME IS DONE
          //PROMPT IF END GAME (3 tries to click yes)
         
        }
      });

      let subscription = this.courtProvider.retrievePlayerSnapshot(this.userProvider.retrieveUserID(), this.court.id).subscribe(async ()=>{
        let player = await this.courtProvider.retrievePlayerStatus(this.userProvider.retrieveUserID(), this.court.id);
        if(player.status=='Confirmed' && this.status=='Waiting'){
          this.status = 'Confirmed';
        }
        else{}
      });
    }
  }

  arrivedCourt(){
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Arrived');
    this.status = 'Waiting'
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
            this.viewCtrl.dismiss().then(()=>{
              
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

  quitGame(type){
    if(type=='Quit'){
      let confirm = this.alertCtrl.create({
        title: 'Quit Game?',
        message: "Do you want to quit the game? You won't receive any points when you quit!",
        buttons: [
          {
            text: 'Quit',
            handler: () => {    
              // this.courtProvider.removePlayer(this.court.id, this.role, this.court.players_count, type);
              this.navCtrl.popToRoot().then(()=>{
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
    else if(type=='Cancel' || type=='Cancel Coming'){
      let confirm = this.alertCtrl.create({
        title: 'Cancel?',
        message: "Do you want to cancel your spot? You will get 1 penalty for this (3 penalties = banned account)",
        buttons: [
          {
            text: 'Yes',
            handler: () => {    
              // this.courtProvider.removePlayer(this.court.id, this.role, this.court.players_count, type);
              this.navCtrl.popToRoot().then(async()=>{
                if(this.role == 'Baller'){
                  let kicked = await this.userProvider.penalizeUser(this.userProvider.retrieveUserID());
                  if(kicked == true){
                    this.afAuth.auth.signOut();
                    this.navCtrl.setRoot('LandingPage');
                  }
                }
              });
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
    else{

    }
  }

  showDirection(){  
    let data = {
      Court: this.court,
      Mode: 'WALKING',
      Page: 'game',
    }
    let modal = this.modalCtrl.create(MapModalPage, data);
    modal.present();
  }



}
