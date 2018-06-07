import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';
import { JoinCourtModalPage } from '../../modals/join-court-modal/join-court-modal';
import { MenuController } from 'ionic-angular';
import { JoinCourtAdminPage } from '../join-court-admin/join-court-admin';

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
  courts: any;
  courtsArray = [];
  status: boolean=true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private courtProvider: CourtProvider, private userProvider: UserProvider, private modalCtrl: ModalController, private menuCtrl: MenuController) {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    this.getCourts();
    console.log('ionViewDidLoad HomeAdminPage');
  }

  async getCourts(){
  
    this.courts=[];
    this.courts = await this.courtProvider.retrieveCourtsUnderAdmin(this.userProvider.retrieveUserID());
  
  }

  manageCourt(court){
    let data = {
      Role: 'Administrator',
      Court: court,
    }
    this.navCtrl.push(JoinCourtAdminPage, data);
  }

  changeStatus(courtId, status, courtAdmin?){
    if(status=='Offline'){
      if(courtAdmin==''){
        this.courtProvider.changeCourtStatus(courtId, 'Offline');
      }
      else{
      }
    }
    else{
      this.courtProvider.changeCourtStatus(courtId, 'Online');
    }
  }

  doRefresh(refresher){
    this.getCourts();
    refresher.complete();
  }

}
