import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CourtProvider } from '../../../providers/court/court';
import { UserProvider } from '../../../providers/user/user';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private userProvider: UserProvider) {
    this.courts = this.courtProvider.retrieveCourtsUnderAdmin(this.userProvider.retrieveUserId());
    // alert(this.courts);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeAdminPage');
  }

}
