import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account/account.model';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';


/**
 * Generated class for the LoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'login',
  templateUrl: 'login.html',
})
export class LoginComponent {

  text: string;
  account = {} as Account;

  constructor(private afAuth: AngularFireAuth, private navCtrl: NavController, private toast: ToastController) {
  }

  async login(){
    try{
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.account.email, this.account.password);
      this.navCtrl.setRoot('HomePage');
    }
    catch(e){
      console.error(e);
        this.toast.create({
          message: e.message,
          duration: 3000,
          position: 'top'
        }).present();
    }
  }

}
