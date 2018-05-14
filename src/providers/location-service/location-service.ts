import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
// import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { UserProvider } from '../user/user';
import { CourtProvider } from '../court/court';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var google: any;

@Injectable()
export class LocationServiceProvider {
  location: any;
  user: any;
  userLatitude: any;
  userLongitude: any;
  userLocation: any;
  constructor( private geolocation: Geolocation) {  
  }

  getUpdatedLocation(){
    let watchOptions: {
      enableHighAccuracy: true;
      maximumAge: 0,
      // timeout: 1000,
    };
    return this.geolocation.watchPosition(watchOptions).filter((position) => position.coords !== undefined); 
  }

  async getCurrentLocation(){
    let watchOptions: {
      enableHighAccuracy: true;
      maximumAge: 0,
      // timeout: 1000,
    };
    let location;
    location = await this.geolocation.getCurrentPosition(watchOptions).then((resp)=>{
      let latitude = resp.coords.latitude;
      let longitude = resp.coords.longitude;
      let accuracy = resp.coords.accuracy;
      // alert(accuracy);
      return {latitude, longitude, accuracy} ;
    });
    return location;
  }

  async getDistanceAndTravelTime(userObj, courtObj){
    let userObject = await userObj;
    let courtObject = await courtObj;
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userObject.latitude, userObject.longitude),new google.maps.LatLng(courtObject.latitude, courtObject.longitude)
    )/1000;

    return Math.round(distance * 100)/100;

  }

}
