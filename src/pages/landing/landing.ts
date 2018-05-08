import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { RegisterComponent } from '../../components/register/register';


/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  private showLogin: boolean = false;
  private showRegister: boolean = false;

  constructor(private navCtrl: NavController, public navParams: NavParams, private modal: ModalController, private menu: MenuController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    this.menu.enable(false);
  }

  login_clicked(): void{
    this.showLogin = !this.showLogin;
  }

  register_clicked(): void{
    this.showRegister = !this.showRegister;
    // const register_modal = this.modal.create(RegisterComponent);
    // register_modal.present();
    // //DELETE MODAL
    //this.navCtrl.push('RegisterPage');
  }

}
