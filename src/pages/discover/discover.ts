import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CourtProvider } from '../../providers/court/court';
import { Court } from '../../models/court/court.model';
import { CourtModalPage } from '../modals/court-modal/court-modal';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { UserProvider } from '../../providers/user/user';

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
  start_time: any;
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
  selectedMode: string = '';
  directionsService = new google.maps.DirectionsService();
  courtObj: CourtObject;
  subscription: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private modalCtrl: ModalController, private location: LocationServiceProvider, private userProvider: UserProvider, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverPage');
  }

  async retrieveClosestCourts(preferredDistance){
    this.nearestCourts = [];
    if(this.selectedMode==''){
      let alert = this.alertCtrl.create({
        title: 'No Mode of Transportation Selected!',
        subTitle: 'Select a mode of tranportation',
        buttons: ['OK']
      });
      alert.present();
      return false;
    }

    var durationTemp;
    this.showSpinner = true;
    this.userLocation = await this.location.getCurrentLocation();
    console.log(this.userLocation.accuracy);

    if(this.userLocation.accuracy > 100){
      this.retrieveClosestCourts(preferredDistance);
      
      console.log(this.userLocation.accuracy);
      return;
    }
    this.userProvider.updateUserLocation(this.userLocation,'discover');
    let courts = this.courtProvider.retrieveCourts().valueChanges();
    this.nearestCourts = [];
    courts.forEach(snapshots=>{
      this.showSpinner = false;
      snapshots.forEach(court => {
        let distance = google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude),new google.maps.LatLng(court.latitude, court.longitude)
        )/1000;
        if(distance<=preferredDistance){ 
          let duration = this.routeInfo(court);
          court.start_time = this.courtProvider.parseStartTime(court.start_time);
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
        var route = response.routes[0];
        document.getElementById(court.name+"time").innerHTML=" ";
        document.getElementById(court.name+"time").innerHTML=route.legs[0].duration.text;
        document.getElementById(court.name+"distance").innerHTML=" ";
        document.getElementById(court.name+"distance").innerHTML=route.legs[0].distance.text;
      }
    });
  }

  openCourt(court){
    var data = { 
      Court : court,
      Page: "discover",
      Mode: this.selectedMode,
    };
    this.navCtrl.push(CourtModalPage, data);
  }
}
