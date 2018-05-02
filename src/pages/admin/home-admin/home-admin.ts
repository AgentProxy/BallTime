import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { JoinCourtModalPage } from '../../modals/join-court-modal/join-court-modal';
import { MenuController } from 'ionic-angular';

/**
 * Generated class for the HomeAdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-admin',
  templateUrl: 'home-admin.html',
})
export class HomeAdminPage {
  courts = [];
  courtsArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private userProvider: UserProvider, private modalCtrl: ModalController, private menuCtrl: MenuController) {
    // alert(this.courts);
    this.getCourts();
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomeAdminPage');
  }

  async getCourts(){
    this.courts=[];
    this.courts = await this.courtProvider.retrieveCourtsUnderAdmin(this.userProvider.retrieveUserID());
  }

  manageCourt(court){
  
    let data = {
      Role: 'Administrator',
      Court: court.data,
    }

    this.navCtrl.push(JoinCourtModalPage,data);
    // let modal = this.modalCtrl.create(JoinCourtModalPage, data);
    // modal.present();
  }

}
