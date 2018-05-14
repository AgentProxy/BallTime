import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProvider } from '../user/user';
import { CourtProvider } from '../court/court';

var google: any;
/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(public http: HttpClient, private userProvider: UserProvider, private courtProvider: CourtProvider) {
    console.log('Hello LocationProvider Provider');
  }


  async getDistanceAndTravelTime(userId, courtId){
    let userObj = await this.userProvider.retrieveUserObject(userId);
    let courtObj = await this.courtProvider.retrieveCourtObject(courtId);
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userObj.latitude, userObj.longitude),new google.maps.LatLng(courtObj.latitude, courtObj.longitude)
    )/1000;

    return distance;
  }

}
