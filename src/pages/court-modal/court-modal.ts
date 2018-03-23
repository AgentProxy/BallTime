import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController) {
    this.page = this.navParams.get('Page');
    if(this.page == "home"){
      this.court = this.navParams.get('Court');
      this.courtDistance = this.navParams.get('Distance');
    }
    else{
      this.court = this.navParams.get('Court');
      this.courtDistance = this.court.distance
      // this.courts = this.courts.sort(this.compare);
    }
  }

  // compare(a,b) {
  //   if (a.distance < b.distance)
  //     return -1;
  //   if (a.distance > b.distance)
  //     return 1;
  //   return 0;
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourtModalPage');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

}
