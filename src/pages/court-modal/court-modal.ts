import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { MapModalPage } from '../modals/map-modal/map-modal';
import { JoinCourtModalPage } from '../modals/join-court-modal/join-court-modal';
import { CourtProvider } from '../../providers/court/court';
import { UserProvider } from '../../providers/user/user';
/**
 * Generated class for the CourtModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-court-modal',
  templateUrl: 'court-modal.html',
})
export class CourtModalPage {

  court: any;
  courts: any;
  courtDistance: any;
  page: string;
  mode: string;
  user: any;
  courtInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, private modalCtrl : ModalController, private alertCtrl: AlertController, private userProvider: UserProvider, private courtProvider: CourtProvider) {
    this.page = this.navParams.get('Page');
    this.user = this.userProvider.retrieveUserInfo();
    this.court = this.navParams.get('Court');

    if(this.page == "home"){
      this.courtDistance = this.navParams.get('Distance');
    }
    else {
      this.courtDistance = this.court.distance;
      this.mode = this.navParams.get('Mode');
    }

    this.courtInfo = this.courtProvider.retrieveCourtLive(this.court.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourtModalPage');
  }

  showDirection(courtInfo){  
    let data = {
      Court: courtInfo,
      Mode: this.mode,
      Page: this.page,
    }
    let modal = this.modalCtrl.create(MapModalPage, data);
    modal.present();
  }

  joinCourt(court){
    let confirm = this.alertCtrl.create({
      title: 'Confirm Join Court',
      message: "Do you want to join this court?",
      buttons: [
        {
          text: 'Join',
          handler: () => {
            let data = {
              Court: court,
            }
            //ADD USER TO COURT VIA COURT PROVIDER      
            if(court.players_count <1 ){
              let modal = this.modalCtrl.create(JoinCourtModalPage, data);
              modal.present();
            }

            else{
                let alert = this.alertCtrl.create({
                  title: 'Court is Full!',
                  subTitle: 'Sorry! The court is currently full. Go find other courts!',
                  buttons: ['OK']
                });
                alert.present();
            }
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

  // confirmJoin(){
  //   let confirm = this.alertCtrl.create({
  //     title: 'Confirm Join Court',
  //     message: "Do you want to join this court?",
  //     buttons: [
  //       {
  //         text: 'Join',
  //         handler: () => {
  //           return true;
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         handler: () => {
  //           return false;
  //         }
  //       }
  //   ]
  //   });
  //   confirm.present();
  // }

  dismiss(){
    this.viewCtrl.dismiss();
  }


}
