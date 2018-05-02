import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CourtProvider } from '../../providers/court/court';
import { UserProvider } from '../../providers/user/user';
import { MapModalPage } from '../modals/map-modal/map-modal';

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
  inGame:boolean = false

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private userProvider: UserProvider, private modalCtrl: ModalController) {
    this.role = this.navParams.get('Role');
    this.status = this.navParams.get('Status');
    this.court = this.navParams.get('Court');


    // this.courtProvider.retrieveCourtSnapshot(this.court.id).subscribe(async ()=>{
    //   let court = await this.courtProvider.courtStatusChanges(this.court.id);
    //   if(court.status == 'Waiting' && this.role =='Baller' && this.status=='Ready'){
    //     this.status="Coming";
    //   }
    // });

    if(this.role == 'Baller'){
      this.courtProvider.retrievePlayerSnapshot(this.userProvider.retrieveUserID(), this.court.id).subscribe(async ()=>{
        let player = await this.courtProvider.retrievePlayerStatus(this.userProvider.retrieveUserID(), this.court.id);
        if(player.status=='Confirmed'&&this.status=='Waiting'){
          this.confirmed = true;
          this.changePlayerStatus(player.status);
        }
        else if(player.status=='In Game' && this.status=='Confirmed'){
          this.changePlayerStatus(player.status);

        }
        else{}
      });
    }
  }

  arrivedCourt(){
    this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Arrived');
    this.status = 'Waiting'
    //update status on court players DONE!!!!
    //change to arrived       
    //admin clicks button to confirm players arrival 
    //  players waits for status change
    //players subscribe to status change
    //if arrived and status is in game
    //change buttons and interface to in game
  }

  changePlayerStatus(status){
    if(status == 'Confirmed'){
      this.courtProvider.updatePlayerStatus(this.userProvider.retrieveUserID(), this.court.id, 'Confirmed');
    }

    this.status = status;
    
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

}
