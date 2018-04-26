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
    this.location.getLocation();        //I DON'T KNOW WHY
  }


  retrieveCourts(){
    this.courts = this.courtCol;
    return this.courts;
  }

  retrieveCourtLive(courtId){
    //GET LIVE DATA FROM COURT
    let courtInfo = this.courtCol.doc(courtId).snapshotChanges().map(action => {
      const data = action.payload.data();
      const id = action.payload.id;
      return { id, ...data };
    }); ;
    return courtInfo;
  }

  // retrieveCourtInfo(courtId){
  //   let courtDoc = this.courtCol.doc(courtId);
  //   let courtInfo = courtDoc.snapshotChanges();
  // }

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
      this.db.doc('courts/' + courtId + '/players/' + id ).set({role:'player', user: data}).then(result => {
        
        this.db.doc('courts/' + courtId ).set({players_count: playersCount}, {merge: true});
      });
      // playersCol.add({newUser});
      // let playerid = playersCol.doc(id).add(newUser).then(player => {
      //   console.log('The auto-generated ID is', player.id);
      //   player.id;
      //   // return playerId;
      // });
      return { id, ...data };
    });
    // let newUser = user;
    // alert(newUser.username);
  }

  // retrievePlayer(user){
  //   this.player = user;
  //   // alert(this.player.username);
  //   return this.player;
  // }





  retrievePlayers(courtId){
    let players = this.courtCol.doc(courtId).collection('players').valueChanges();
    return players;
  };


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
    this.userLocation = this.location.getLocation();
    this.distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),new google.maps.LatLng(court.latitude, court.longitude)
    )/1000;
    return this.distance;
  }

  //ASK SIR NILO
  // convertToKM(distanceM){
  //   let distanceKM = distanceM/1000;
  //   return distanceKM;
  // }

}
