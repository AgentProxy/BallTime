import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { MapModalPage } from '../../modals/map-modal/map-modal';
import { JoinCourtModalPage } from '../../modals/join-court-modal/join-court-modal';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { WaitingPage } from '../../modals/waiting/waiting';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocationServiceProvider } from '../../../providers/location-service/location-service';
/**
 * Generated class for the CourtModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-court-modal',
  templateUrl: 'court-modal.html',
})
export class CourtModalPage {

  court: any;
  courts: any;
  courtName:any;
  courtObj: any;
  Object:any;
  courtDistance: any;
  page: string;
  mode: string;
  user: any;
  courtInfo: any;
  courtStatus: any;
  playersAllowed: any;
  playersCount: any;
  startTime: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, private modalCtrl : ModalController, 
     private alertCtrl: AlertController, private userProvider: UserProvider, private courtProvider: CourtProvider, private db : AngularFirestore,
      private locationProvider: LocationServiceProvider) {
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

   this.courtChanges();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourtModalPage');
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

  async courtDetails(courtObj){
    this.courtName = courtObj.name;
    this.courtStatus = courtObj.status;
    this.playersAllowed = (courtObj.players_allowed-2);
    this.playersCount = courtObj.players_count;
    this.courtStatus = courtObj.status;
    this.courtDistance = await this.locationProvider.getDistanceAndTravelTime(this.userProvider.retrieveUserObject(this.userProvider.retrieveUserID()),this.courtProvider.retrieveCourtObject(this.court.id));
    this.startTime = courtObj.start_time;
    this. startTime = this.courtProvider.parseStartTime(this.startTime);

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
              Role: 'Baller',
              Court: court,
            }
            //ADD USER TO COURT VIA COURT PROVIDER  
            if(this.courtDistance>=20){
              let alert = this.alertCtrl.create({
                title: 'Court is far away!',
                subTitle: "You can't join a court farther than 20 km!",
                buttons: ['OK']
              });
              alert.present();
              return;
            }
            
            if(this.playersCount <= this.playersAllowed ){
              let modal = this.modalCtrl.create(WaitingPage, data);
              modal.present();
            }
            else{
                let alert = this.alertCtrl.create({
                  title: 'Court is Full!',
                  subTitle: 'Sorry! The court is currently full. There are no more spots for substitutes. Go find other courts!',
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

  // playerCountChanges(){
  //   this.db.doc('courts/'+this.court.id).valueChanges().subscribe(async x => {
  //     this.playersCount =  await this.courtProvider.retrieveCourtPlayersCount(this.court.id);
  //   })
  // }

  dismiss(){
    this.viewCtrl.dismiss();
  }


}
