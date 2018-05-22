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
  maps: any;
  
  constructor( private geolocation: Geolocation) {  
    this.maps = google.maps;
  }

  getUpdatedLocation(){
    let watchOptions: {
      enableHighAccuracy: true;
      maximumAge: 0,
      timeout: 5000,
    };
    return this.geolocation.watchPosition(watchOptions).filter((position) => position.coords !== undefined); 
  }

  async getCurrentLocation(){
    let watchOptions: {
      enableHighAccuracy: true;
      maximumAge: 0,
      timeout: 5000,
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
    let distance = this.maps.geometry.spherical.computeDistanceBetween(
      new this.maps.LatLng(userObject.latitude, userObject.longitude),new this.maps.LatLng(courtObject.latitude, courtObject.longitude)
    )/1000;

    let returnDistance = Math.round(distance * 100)/100;
    if(Number.isNaN(returnDistance)){
      returnDistance = 0;
    }
    
    return returnDistance;

  }

}
