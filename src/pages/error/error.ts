import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

/**
 * Generated class for the ErrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
})
export class ErrorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public network: Network, private viewCtrl: ViewController) {
    this.network.onConnect().subscribe(() => {
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ErrorPage');
  }

}
