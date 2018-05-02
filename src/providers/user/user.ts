import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user/user.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class UserProvider {
    private userCol = this.db.collection<User>('users');
    private userDoc: AngularFirestoreDocument<User>;
    private userCollection: AngularFirestoreCollection<User>;
    userInfo: any;
    users: Observable<User>;
    // uid: any;

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth,){
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
            longitude: '',
            latitude: '',
            role: 'baller',
        });
        
        // return this.UserCol.push(user);
    }

    createUser(userId){
        this.db.doc('users/' + userId).set({
            uid: userId,
            registered: false,
        });
    }

    retrieveUserID(){
        // this.uid = this.afAuth.auth.currentUser.uid;
        return this.afAuth.auth.currentUser.uid; 
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

    updateUserLocation(position){
        this.db.collection('users').doc(this.retrieveUserID()).update({longitude: position.coords.longitude.toString(), latitude: position.coords.latitude.toString()})
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