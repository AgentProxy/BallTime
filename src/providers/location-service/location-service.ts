import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';

/*
  Generated class for the LocationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationServiceProvider {
  location: any;
  user: any;
  userLatitude: any;
  userLongitude: any;
  userLocation: any;
  constructor(public http: HttpClient, private geolocation: Geolocation, private backgroundGeolocation: BackgroundGeolocation) {
    // console.log('Hello LocationServiceProvider Provider');
    
    
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
    // if(location.accuracy>150){
    //   alert(location.accuracy);
    //   this.getCurrentLocation();
    //   return false;
    // }
    // else{
      return location;
    // }
  }

}
