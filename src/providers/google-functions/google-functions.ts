import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var google; 
/*
  Generated class for the GoogleFunctionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleFunctionsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello GoogleFunctionsProvider Provider');
  }

  getDirections(request, fn){
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    let directions: any;

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        // directionsDisplay.setDirections(result);
        directions = result;
        fn(result);
      }
    });
    // return directions;
  }

  

}
