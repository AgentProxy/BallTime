import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Court } from '../../models/court/court.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { LocationServiceProvider } from '../location-service/location-service';

declare var google: any;
/*
  Generated class for the CourtProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CourtProvider {

  courtsCollection: AngularFirestoreCollection<Court>;
  courts: Observable<Court[]>;
  userLocation: any;
  distance: any;
  nearestCourts = [];
 
  
  constructor(private http: HttpClient, private db: AngularFirestore, private location: LocationServiceProvider) {
    this.location.getLocation();        //I DON'T KNOW WHY
  }


  retrieveCourts(){
    this.courtsCollection = this.db.collection('courts');
    this.courts = this.courtsCollection.valueChanges();
    return this.courts;
  }

  //Special thanks to: Dmozzy for calculating distance code https://gist.github.com/dmozzy/2398636 
  retrieveClosestCourts(preferredDistance){
    this.userLocation = this.location.getLocation();
    this.courts = this.retrieveCourts();
    this.nearestCourts = [];
    this.courts.subscribe(snapshots=>{
      snapshots.forEach(court => {

          this.distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),new google.maps.LatLng(court.latitude, court.longitude)
        )/1000;

        if(this.distance<=preferredDistance){
          let courtObj = {
            name: court.name,
            distance: this.distance,
            category: court.category,
            status: court.status,
          }
          this.nearestCourts.push(courtObj);
        }
      });
    
    });
    return this.nearestCourts;
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
