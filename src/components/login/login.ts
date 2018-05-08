import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account/account.model';
import { NavController, Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import * as firebase from 'firebase/app';
import { UserProvider } from '../../providers/user/user';



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

  constructor(private afAuth: AngularFireAuth, private navCtrl: NavController, private toast: ToastController, public events: Events, private userProvider: UserProvider) {
  }

  async login(){
    
    try{
      const result = await this.afAuth.auth.signInWithEmailAndPassword(this.account.email, this.account.password).then(()=>{
        this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        this.loggedIn(); 
      });
      
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


  async loggedIn(){
    let role = await this.userProvider.retrieveRole(this.userProvider.retrieveUserID());
    if(role=='Baller'){
      this.navCtrl.setRoot('HomePage');
    }
    else if(role=='Administrator'){
      this.navCtrl.setRoot('HomeAdminPage');
    }
    this.events.publish('user:login');
  }

}
