import { Injectable } from '@angular/core';
import { User } from '../models/user/user.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class UserService {
    private userCol = this.db.collection<User>('users');
    private userDoc: AngularFirestoreDocument<User>;
    private userCollection: AngularFirestoreCollection<User>;
    userInfo: Observable<User>;
    users: Observable<User>;

    constructor(private db: AngularFirestore, private afAuth: AngularFireAuth,){

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
        });
        
        // return this.UserCol.push(user);
    }

    createUser(userId){
        this.db.doc('users/' + userId).set({
            uid: userId,
        });
    }

    retrieveUserId(){
        return this.afAuth.auth.currentUser.uid; 
    }

    retrieveUserInfo(){
        this.userDoc = this.db.doc<User>('users/' + this.retrieveUserId());
        this.userInfo = this.userDoc.valueChanges();
        return this.userInfo;
    }

    retrieveUsers(){
        this.userCollection = this.userCol;
        return this.userCollection;
        
    }

}