import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Court } from '../../models/court/court.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocationServiceProvider } from '../location-service/location-service';
import { UserProvider } from '../user/user';
import { User } from '../../models/user/user.model';
import { ChatProvider } from '../chat/chat';

declare var google: any;
/*
  Generated class for the CourtProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CourtProvider {

  courts: AngularFirestoreCollection<Court>;
  courtCol = this.db.collection<Court>('courts');
  userLocation: any;
  distance: any;
  nearestCourts = [];
  player:any;
  
  constructor(private http: HttpClient, private db: AngularFirestore, private location: LocationServiceProvider, private userProvider: UserProvider, private chatProvider: ChatProvider) {

  }

  async addAdminToCourt(user,courtId){
    let userObj = await user;
    let adminId = userObj.uid;
    this.db.collection('courts').doc(courtId).collection('admin').doc(adminId).set({user: userObj}, {merge: true}).then( ()=>{
      this.db.collection('courts').doc(courtId).set({current_admin: adminId},{merge: true});
    });
  }

  async addUserToCourt(user, courtId){
    let userObj = await user;
    let playersCol = this.courtCol.doc(courtId).collection('players');
    let newUser = {
      role: 'player',
      user: userObj,
    }
    let id = playersCol.add(newUser).then(player => {
      console.log('The auto-generated ID is', player.id);
      let playerId: any;
      playerId = player.id;
      return playerId;
    });
    let playerId = await id;
    return playerId;
  }

  addUserToCourt2(user, courtId, playersCount){
    playersCount++;
    let playersCol = this.courtCol.doc(courtId).collection('players');
    user.subscribe(action => {
      const id = action.payload.id;
      const data = action.payload.data();
      this.db.doc('courts/' + courtId + '/players/' + id ).set({user: data, status: ''}).then(result => {
        
        this.db.doc('courts/' + courtId ).set({players_count: playersCount}, {merge: true});
      });
      return { id, ...data };
    });
  }

  checkPlayersInCourt(courtId){
    let query = this.db.collection('courts').doc(courtId).ref.get().then((snapShot)=>{
      if(snapShot.data().players_confirmed == snapShot.data().players_count){
        return true;
      }
      else{
        return false;
      }
    }); 
    return query;
  }

  courtStatusChanges(courtId){
    let query = this.db.doc('courts/' + courtId).ref.get().then((docSnapshot) => {
      if (docSnapshot.exists){
        status = docSnapshot.data().status;
      } 
      else{
      }
      return {status};
    });
    return query;
  }


  async currentAdminExists(courtId){
    let court = await this.db.collection('courts').doc(courtId);
    let courtObj = await court.ref.get();
    return courtObj.data().current_admin;
  }

  retrieveCourts(){
    this.courts = this.courtCol;
    return this.courts;
  }

  async retrieveCourtLive(courtId){
    //GET LIVE DATA FROM COURT
    let courtInfo = await  this.courtCol.doc(courtId).snapshotChanges().map(action => {
      const data = action.payload.data();
      const id = action.payload.id;
      return { id, ...data };
    });
    return courtInfo;
  }

  async retrieveCourtsUnderAdmin(userId){
    let adminCourts = [];
    let courts = this.db.collection('courts_admin', ref=>ref.where('admin_id','==',userId));
    
    courts.snapshotChanges().subscribe(snapshots=>{
      snapshots.forEach(async snapshot =>{
        const id = snapshot.payload.doc.data().court_id;
        this.db.collection('courts').doc(id).snapshotChanges().subscribe((court)=>{
          let courtObj = {
            data: court.payload.data(),
          }

          adminCourts.push(courtObj);
        })
      });
    });
    return adminCourts;
  }

  retrieveAdmin(courtId){
    let admin = this.db.collection('courts').doc(courtId).collection('admin');
    let adminRef = admin.valueChanges();
    return adminRef;
  }

  removeAdminFromCourt(courtId, adminId){
    this.db.collection('courts').doc(courtId).collection('admin').doc(adminId).delete().then(()=>{
      this.db.collection('courts').doc(courtId).set({current_admin: ''}, {merge: true});
    })
    return true;
  }

  retrievePlayers(courtId){
    let players = this.courtCol.doc(courtId).collection('players').valueChanges();
    return players;
  };

  retrievePlayerSnapshot(userId, courtId){
    return  this.courtCol.doc(courtId).collection('players').doc(userId).snapshotChanges();
  }

  retrievePlayerStatus(userId, courtId){
    let status = '';
    let query = this.db.doc('courts/' + courtId + '/players/' + userId).ref.get().then((docSnapshot) => {
      if (docSnapshot.exists){
        status = docSnapshot.data().status;
      } 
      else{
      }
      return {status, userId};
    });
    return query;
  }


  removePlayer(playerId, courtId, playersCount){
    playersCount = playersCount--;
    let courtDoc = this.courtCol.doc(courtId).collection('players').doc(playerId).delete().then(result => {
      this.db.doc('courts/' + courtId ).set({players_count: playersCount}, {merge: true});
    });    
    if(playersCount==0){
      this.chatProvider.deleteCourtChat(courtId);
    }
  }

  retrieveCourtDistance(court){
    this.userLocation = this.userProvider.retrieveUserLocation();
    this.distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),new google.maps.LatLng(court.latitude, court.longitude)
    )/1000;
    return this.distance;
  }

  async readyCourt(courtId, limit){
    let court: any;
    let count: number;

    court = await this.db.collection('courts').doc(courtId).ref.get();
    count = court.data().players_ready;
     if(count==limit){
       alert(true);
        this.db.collection('courts').doc(courtId).set({status: 'Waiting'}, {merge: true}).then(()=>{
          this.db.collection('courts').doc(courtId).set({players_ready: 0}, {merge: true});
        });
        return true;
      }
    else{
      return false;
    }
  }

  retrieveCourtSnapshot(courtId){
    return this.db.collection('courts').doc(courtId).snapshotChanges();
  }

  updatePlayerStatus(userId, courtId, status){
    this.db.doc('courts/' + courtId + '/players/' + userId ).set({status: status},{merge: true}).then(()=>{
      this.db.doc('courts/' + courtId).ref.get().then(snap => {
        if(status=='Ready'){
          this.db.doc('courts/' + courtId).update({players_ready: snap.data().players_ready + 1});
          return;
        }
        else if(status==''){
          alert('minus players');
          let players_ready_count = snap.data().players_ready - 1;
          this.db.doc('courts/' + courtId).update({players_ready: players_ready_count});
          return;
        }
        else if(status=='Confirmed'){
          // let players_ready_count = snap.data().players_ready - 1;
          this.db.doc('courts/' + courtId).update({players_confirmed: (snap.data().players_confirmed + 1)});
          return;
        }

        else{}
      });
    })
  }


  unreadyCourt(courtId){
    this.db.collection('courts').doc(courtId).set({status: 'Waiting'}, {merge: true});
  }

}
