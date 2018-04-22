import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

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
  constructor(public http: HttpClient, private geolocation: Geolocation) {
    // console.log('Hello LocationServiceProvider Provider');
    this.location = geolocation;
    
  }

  //returns users current Location's Latitude and Longitude in an object
  getLocation(){
    // var userLatitude;
    // var userLongitude;

    this.location.getCurrentPosition().then((resp) => {
      this.userLatitude = resp.coords.latitude;
      this.userLongitude = resp.coords.longitude;  
      this.userLocation = {
        latitude: this.userLatitude,
        longitude: this.userLongitude,
      }; 
    })
    .catch((error) => {
      return false;
    });

    return this.userLocation;

    // var userLocation = {
    //     latitude: this.userLatitude,
    //     longitude: this.userLongitude,
    // }
    // return this.userLatitude;
    
    // return this.location.getCurrentPosition();
  }

  //get always updating location of user
  getUpdatedLocation(){
    let watchOptions: {
      enableHighAccuracy: true;
      maxAge: 0,
      timeout: 1000,
    };

    return this.location.watchPosition(watchOptions)
  }

}
