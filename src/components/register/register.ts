import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account/account.model';
import { ToastController, ViewController } from 'ionic-angular';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { RegisterPage } from '../../pages/register/register';

/**
 * Generated class for the RegisterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'register',
  templateUrl: 'register.html'
})
export class RegisterComponent {

  confirm_password: string;

  account = {} as Account;

  constructor(private toast: ToastController, private afAuth: AngularFireAuth, private navCtrl: NavController, private userProvider: UserProvider, private viewCtrl: ViewController,) {
  }

  userId : string;

  async register(){
    if(this. account.password == this.confirm_password){
      try {
        const result = await this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(this.account.email, this.account.password);
        this.toast.create({
          message: "Account Successfully Created. ",
          duration: 3000
        }).present();
        this.userId = this.afAuth.auth.currentUser.uid;
        this.userProvider.createUser(this.userId);
        this.navCtrl.push(RegisterPage);        
      }
      catch(e){
        console.error(e);
        this.toast.create({
          message: e.message,
          duration: 3000
        }).present();
      }
    }
    else{
      this.toast.create({
        message: 'Passwords do not match!',
        duration: 3000
      }).present();
    }
  // this.navCtrl.push('RegisterPage');
  }

  // closeRegister(){
  //   this.viewCtrl.dismiss();
  // }
  
}
