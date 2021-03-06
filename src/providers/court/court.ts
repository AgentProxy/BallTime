import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Court } from '../../models/court/court.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserProvider } from '../user/user';
import { User } from '../../models/user/user.model';
import { LocationServiceProvider } from '../location-service/location-service';
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
  
  constructor(private db: AngularFirestore, private userProvider: UserProvider, private chatProvider: ChatProvider, private locationProvider: LocationServiceProvider) {

  }

  async addAdminToCourt(user,courtId){
    let userObj = await user;
    let adminId = userObj.uid;
    this.db.collection('courts').doc(courtId).set({current_admin: adminId},{merge: true}).then(()=>{
      this.db.collection('courts').doc(courtId).collection('admin').doc(adminId).set({user: userObj}, {merge: true})
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

  addUserToWaitlist(user, courtId){
    let subscription = user.subscribe(async action => {
      const id = action.payload.id;
      const data = action.payload.data();
      let distance = await this.locationProvider.getDistanceAndTravelTime(this.userProvider.retrieveUserObject(id),this.retrieveCourtObject(courtId));
      this.db.doc('courts/' + courtId + '/waitlist/' + id ).set({user: data, status: '', distance: distance}).then(async result => {
        subscription.unsubscribe();
      });
    });
    
  }

  changeCourtStatus(courtId, status){
    this.db.collection('courts').doc(courtId).set({status: status}, {merge: true});

    if(status == 'In Game'){
      this.db.collection('courts').doc(courtId).set({players_confirmed: 0},{merge: true})
      // .then(()=>{
      //   this.courtCol.doc(courtId).collection('players').snapshotChanges().subscribe(snapshots=>{
      //     snapshots.forEach(snapshot => {
      //       alert('changing');
      //       this.db.collection('courts').doc(courtId).collection('players').doc(snapshot.payload.doc.data().user.uid).set({status: 'In Game'}, {merge: true});
      //     });
      //   });
      // });
    }
    else if(status=='Offline'){
      this.db.collection('courts').doc(courtId).set({players_confirmed: 0, players_count: 0, players_ready: 0},{merge: true})
    }
    else{}
    return true;
  }

  changePlayersAllowed(value,courtId){
    this.db.collection('courts').doc(courtId).set({players_allowed: value},{merge: true});
  }

  changePlayerStatus(userId, courtId, status ){
    if(status=='Accepted'||status=='Rejected'){
      this.db.collection('courts').doc(courtId).collection('waitlist').doc(userId).set({status: status}, {merge: true}).then(()=>{
        if(status=='Rejected'){
          this.removeUserFromWaitlist(userId, courtId);
        }
      });
      
    }
    else{
      this.db.collection('courts').doc(courtId).collection('players').doc(userId).set({status: status}, {merge: true});
    }
  }

  changeStartTime(startTime,courtId){
    this.db.collection('courts').doc(courtId).set({start_time: startTime},{merge: true});
  }

  checkPlayersInCourt(courtId, playersAllowed?){
    let query = this.db.collection('courts').doc(courtId).ref.get().then((snapShot)=>{
      let limit = playersAllowed
      if(limit == 4){
        limit=2
      }
      
      if(snapShot.data().players_confirmed >= snapShot.data().players_count){
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

  endGame(courtId, role){
    if(role=='Administrator'){
      this.db.collection('courts').doc(courtId).set({status: 'Online'},{merge: true}).then(()=>{
        this.courtCol.doc(courtId).collection('players').snapshotChanges().map(actions => {
          return actions.map(a => {
            this.db.collection('courts').doc(courtId).collection('players').doc(a.payload.doc.data().user.uid).set({status: ''}, {merge: true});
          }); 
        });
      });
      this.db.collection('courts').doc(courtId).set({players_confirmed: 0, players_ready: 0},{merge: true});
    }  
  }

  kickPlayer(playerId, courtId){
    let query = this.db.collection('courts').doc(courtId).ref.get().then((snapShot)=>{
       let playersCount = snapShot.data().players_count;
       this.db.collection('courts').doc(courtId).collection('players').doc(playerId).set({status: 'Kicked'}, {merge: true}).then(() =>{
        this.removePlayer(playerId,courtId,playersCount);
      });
    }); 
  }

  parseStartTime(startTime){
    if(startTime==''){
      return '';
    }
    let time = startTime.split(':');
    let hour = parseInt(time[0]);
    let suffix = " AM";
    if(hour > 12){
      hour = hour - 12;
      suffix = " PM";
    }
   startTime = hour.toString() + ':' + time[1] + suffix;
   return startTime;
  }

  retrieveCourts(){
    // this.courts = this.db.collection('courts', ref=>ref.where('status','==', 'Online').where('status','==','In Game').where('status','==', 'Waiting'));
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

  async retrieveCourtObject(courtId){
    let courtDoc;
    courtDoc = this.db.doc('courts/' + courtId);
    let courtObj:any;
    courtObj = await courtDoc.ref.get();
    return courtObj.data();
  }

  async retrieveCourtsUnderAdmin(userId){

    let adminCourtsArray = [];
    let courts = this.db.collection('courts_admin', ref=>ref.where('admin_id','==',userId));
    let adminCourts = courts.snapshotChanges().subscribe(snapshots=>{
      snapshots.forEach(async snapshot =>{
        const id = snapshot.payload.doc.data().court_id;
        this.db.collection('courts').doc(id).ref.get().then(a=>{
         adminCourtsArray.push(a.data());
        })
      });
    });
    return adminCourtsArray;
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


  removePlayer(playerId, courtId, playersCount, type?){
    playersCount = playersCount-1;
    if(playersCount < 0){
      playersCount = 0
    }

    if(type=='Quit'){
    }

    else if (type=='Cancel'||type=='Cancel Coming'){

    }

    else{

    }

    let courtDoc = this.courtCol.doc(courtId).collection('players').doc(playerId).delete().then(result => {
      this.db.doc('courts/' + courtId ).set({players_count: playersCount}, {merge: true});
    });    
    if(playersCount==0){
      this.chatProvider.deleteCourtChat(courtId);
    }
  }

  removeUserFromWaitlist(userId, courtId){
    this.db.collection('courts').doc(courtId).collection('waitlist').doc(userId).delete();
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
     if(count>=limit){
        this.db.collection('courts').doc(courtId).set({status: 'Waiting'}, {merge: true}).then(()=>{
          this.db.collection('courts').doc(courtId).set({players_ready: 0}, {merge: true});
        });
        return true;
      }
    else{
      return false;
    }
  }

  retrieveCourtPlayersCount(courtId){
    let query = this.db.doc('courts/' + courtId).ref.get().then((docSnapshot) => {
      let count;
      if (docSnapshot.exists){
        count = docSnapshot.data().players_count;
      } 
      else{
        count = '';
      }
      return count;
    });
    return query;
  }

  retrieveCourtSnapshot(courtId){
    return this.db.collection('courts').doc(courtId).snapshotChanges();
  }

  retrieveWaitlisted(courtId){
    return this.db.collection('courts/' + courtId + '/waitlist', ref => ref.where('status','==','')).valueChanges();
  }

  retrieveWaitlistedUser(userId, courtId){
   return this.db.collection('courts').doc(courtId).collection('waitlist').doc(userId).snapshotChanges();
  }

  retrieveWaitlistedUserStatus(userId, courtId){
    let query = this.db.collection('courts').doc(courtId).collection('waitlist').doc(userId).ref.get().then((docSnapshot) => {
      if (docSnapshot.exists){
        status = docSnapshot.data().status;
      } 
      else{
      }
      return {status};
    });
    return query;
  }

  rewardPlayers(userId){
    this.db.collection('users').doc(userId).ref.get().then(snap => {
      let reputation_points = snap.data().reputation_points + 150;
      let reputation_level = snap.data().reputation_level;
      if(reputation_level>=5){
        this.db.collection('users').doc(userId).set({games_played: (snap.data().games_played + 1), reputation_points: reputation_points}, {merge: true});
      }
      else{
        if(reputation_points==150 ||reputation_points  == 1500 || reputation_points  == 4500 || reputation_points == 7500 || reputation_points == 10500 || reputation_points == 15000){
          reputation_level++;
          this.db.collection('users').doc(userId).set({games_played: (snap.data().games_played + 1), reputation_points: reputation_points, reputation_level: reputation_level}, {merge: true});
        }
        else{
          this.db.collection('users').doc(userId).set({games_played: (snap.data().games_played + 1), reputation_points: reputation_points}, {merge: true});
        }
      }
    });
  }

  updatePlayerStatus(userId, courtId, status){
    this.db.doc('courts/' + courtId + '/players/' + userId ).set({status: status},{merge: true}).then(()=>{
      this.db.doc('courts/' + courtId).ref.get().then(snap => {
        if(status=='Ready'){
          this.db.doc('courts/' + courtId).update({players_ready: snap.data().players_ready + 1});
          return;
        }
        else if(status==''){
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
    this.db.collection('courts').doc(courtId).set({status: 'Online'}, {merge: true});
  }

}
