import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { CourtProvider } from '../../providers/court/court';
import { Court } from '../../models/court/court.model';
import { Observable } from 'rxjs/Observable';
import { CourtModalPage } from '../court-modal/court-modal';

/**
 * Generated class for the DiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  preferredDistance = 1;
  currentDistance: any;
  nearestCourts: any;
  x:any;
  nearest =  [];
  // nearestCourts: Observable<Court[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private courtProvider: CourtProvider, private modalCtrl: ModalController) {
    this.courtProvider.retrieveClosestCourts(this.preferredDistance);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverPage');
  }

  discoverCourts(){      //include location
    this.nearestCourts = this.courtProvider.retrieveClosestCourts(this.preferredDistance);
    setTimeout(() => {

    } ,100);
    console.log(this.nearestCourts);
    
  }

  openModal(court){
    var data = { 
      
      Court : court,
      Page: "discover",
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
