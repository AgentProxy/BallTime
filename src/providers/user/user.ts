import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user/user.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';

@Injectable()
export class UserProvider {
    private userCol = this.db.collection<User>('users');
    private userDoc: AngularFirestoreDocument<User>;
    private userCollection: AngularFirestoreCollection<User>;
    userInfo: any;
    users: any;
    // uid: any;

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private alertCtrl: AlertController){
        // this.uid = this.retrieveUserID();
    }
    existingUserId : string;
    
    addUserInfo(user: User){
        this.existingUserId = this.afAuth.auth.currentUser.uid; 
        return this.userCol.doc(this.existingUserId).set({
            uid: this.existingUserId,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            middle_initial: user.middle_initial,
            age: user.age,
            height: user.height,
            weight: user.weight,
            profile_pic: user.profile_pic,
            registered: user.registered,   
            role: 'Baller',
            latitude: '',
            longitude: '',
            penalty: 0,
            reputation_points: 0,
            reputation_level: 0,
            games_played: 0,
        });
        
        // return this.UserCol.push(user);
    }

    createUser(userId){
        this.db.doc('users/' + userId).set({
            uid: userId,
            registered: false,
        });
    }

    async penalizeUser(userId){
        let penalty = await this.retrieveUserObject(userId);
        this.db.collection('users').doc(userId).set({penalty: (penalty.penalty+1)}, {merge: true});
        if(penalty>=5){
        let alert = this.alertCtrl.create({
            title: 'Account Banned!',
            subTitle: 'You have accumulated 5 penalties! Please contact the administrator',
            buttons: ['OK']
        });
        this.db.collection('penalties').doc(userId).set({user_id: userId, status: 'Blocked'}, {merge: true});
        alert.present();
        return false;
        }
    }

    retrieveUserID(){
        let uid = this.afAuth.auth.currentUser.uid;
        if (uid){
            return this.afAuth.auth.currentUser.uid; 
        }
        else{
            this.retrieveUserID();
            // return false;
        }

    }

    retrieveUserInfo(){
        this.userDoc = this.db.doc<User>('users/' + this.retrieveUserID());
        this.userInfo = this.userDoc.snapshotChanges();
        return this.userInfo;
    }

    retrieveUserInfoValue(userId){
        this.userDoc = this.db.doc<User>('users/' + userId);
        this.userInfo = this.userDoc.valueChanges();
        return this.userInfo;
    }

    retrieveUserInfoLive(userId){
        this.userDoc = this.db.doc<User>('users/' + userId);
        this.userInfo = this.userDoc.snapshotChanges();
        return this.userInfo;
    }

    //BEST EXAMPLE
    async retrieveUserObject(userId){
        this.userDoc = this.db.doc<User>('users/' + userId);
        let userObj:any;
        userObj = await this.userDoc.ref.get();
        return userObj.data();
    }

    retrieveUsers(){
        this.userCollection = this.db.collection('users', ref => ref.orderBy('username','asc'));
        return this.userCollection.snapshotChanges();
    }

    async retrieveRole(userId){
        this.userDoc = this.db.doc<User>('users/' + userId);
        let userObj:any;
        userObj = await this.userDoc.ref.get();
        return userObj.data().role;
    }

    updateUserLocation(position,type){
        if(type=='discover'){
            this.db.collection('users').doc(this.retrieveUserID()).update({longitude: position.longitude.toString(), latitude: position.latitude.toString()})
        }
        else{
            this.db.collection('users').doc(this.retrieveUserID()).update({longitude: position.coords.longitude.toString(), latitude: position.coords.latitude.toString()})
        }
    }


    updateUserProfile(userObj, userId){
        this.db.doc('users/' + userId).update({
            username: userObj.username,
            firstname: userObj.firstname,
            lastname: userObj.lastname,
            middle_initial: userObj.middle_initial,
            age: userObj.age,
            height: userObj.height,
            weight: userObj.weight,
        });
    }

    async retrieveUserLocation(){
        this.userDoc = this.db.doc<User>('users/' + this.retrieveUserID());
        let userObj:any;
        userObj = await this.userDoc.ref.get();
        let userLocation = {
            latitude: userObj.data().latitude,
            longitude: userObj.data().longitude
        }
        return userLocation;
    }


}