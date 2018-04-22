import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CourtProvider } from '../../providers/court/court';
import { Court } from '../../models/court/court.model';
import { Observable } from 'rxjs/Observable';
import { CourtModalPage } from '../court-modal/court-modal';
import { LocationServiceProvider } from '../../providers/location-service/location-service';

declare var google: any;

/**
 * Generated class for the DiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
interface CourtObject {
  name: string,
  distance: any,
  category: string,
  status: string,
  duration: any,
}

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})


export class DiscoverPage {

  preferredDistance = 1;
  currentDistance: any;
  nearestCourts: any;
  showSpinner: boolean = false;
  userLocation: any;
  selectedMode: string;
  directionsService = new google.maps.DirectionsService();
  courtObj: CourtObject;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private modalCtrl: ModalController, private location: LocationServiceProvider) {
    // this.courtProvider.retrieveClosestCourts(this.preferredDistance);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverPage');
  }

  // discoverCourts(){      //include location
  //   // this.nearestCourts = this.courtProvider.retrieveClosestCourts(this.preferredDistance);
  //   setTimeout(() => {

  //   } ,100);
  //   console.log(this.nearestCourts);
    
  // }

  retrieveClosestCourts(preferredDistance){
    var durationTemp;
    this.showSpinner = true;
    this.userLocation = this.location.getLocation();
    let courts = this.courtProvider.retrieveCourts().valueChanges();
    this.nearestCourts = [];
    
    courts.subscribe(snapshots=>{
      this.showSpinner = false;
      snapshots.forEach(court => {
        let distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),new google.maps.LatLng(court.latitude, court.longitude)
        )/1000;
        if(distance<=preferredDistance){
          
          let duration = this.routeInfo(court);
          // alert(duration);
          this.nearestCourts.push(court);
        }
      });
    });
    
    return this.nearestCourts;
  }

  routeInfo(court){
    console.log("court");
    var request = {
      origin: new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),
      destination: new google.maps.LatLng(court.latitude, court.longitude),
      travelMode: google.maps.TravelMode[this.selectedMode]
    };
    let duration = "";
    this.directionsService.route(request,  function(response, status) {
      if (status == 'OK') {
        // var deferredObj = new deferred();
        var route = response.routes[0];
        console.log(route);
        // alert(route.legs[0].duration.text);
        document.getElementById(court.name+"time").innerHTML=" ";
        document.getElementById(court.name+"time").innerHTML=route.legs[0].duration.text;
        document.getElementById(court.name+"distance").innerHTML=" ";
        document.getElementById(court.name+"distance").innerHTML=route.legs[0].distance.text;
        // passResults(response);
      }
    })
    // alert(duration);
    // return await duration;
    // function passResults(response){
    //   duration = response.routes[0].legs[0].duration.text;
    // }
    // return duration;
  }

  retrieveClosestCourtsInfo(courts){

    courts.forEach(court => {
      let courtCoords = new google.maps.LatLng(court.latitude,court.longitude);
      let userCoords = new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude);
      var request = {
        origin: userCoords,
        destination: courtCoords,
        travelMode: google.maps.TravelMode[this.selectedMode]
      };
      this.directionsService.route(request, function(response, status) {
        if (status == 'OK') {
          console.log(response);
        }
      });
    });
    // google.maps.DirectionService().route();
  }

  openModal(court){
    var data = { 
      Court : court,
      Page: "discover",
      Mode: this.selectedMode,
    };
    let modal = this.modalCtrl.create(CourtModalPage, data);
    modal.present();
  }
  
  // compare(a,b) {
  //   if (a.distance < b.distance)
  //     return -1;
  //   if (a.distance > b.distance)
  //     return 1;
  //   return 0;
  // }
  
 

    // Set destination, origin and travel mode.
    // var request = {
    //   destination: preferredDistance,
    //   origin: chicago,
    //   travelMode: 'WALKING'
    // };

    // // Pass the directions request to the directions service.
    // var directionsService = new google.maps.DirectionsService();
    // directionsService.route(request, function(response, status) {
    //   if (status == 'OK') {
    //     // Display the route on the map.
    //     directionsDisplay.setDirections(response);
    //   }
    // });
  

}
