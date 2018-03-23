import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { CourtProvider } from '../../providers/court/court';
import { AlertController } from 'ionic-angular';
import { CourtModalPage } from '../court-modal/court-modal';

declare var google: any;
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 * 
 * THANKS TO: e666 from StackOverflow (https://stackoverflow.com/questions/40839603/how-to-auto-update-current-location-on-google-map-in-ionic-2-application)
 * for Map Location Marker
 * 
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapRef: ElementRef;
  map: any;
  currentLocation : any;
  platform: any;

  constructor(platform: Platform,  public navCtrl: NavController, public navParams: NavParams,
      private locationProvider: LocationServiceProvider, private courtProvider: CourtProvider,
      private alertCtrl: AlertController, private modalCtrl: ModalController ){
          // this.location = this.locationProvider;
          this.currentLocation = this.locationProvider.getUpdatedLocation();
          this.platform = platform;
    }

  ionViewDidLoad() {
    this.showMapAndLocation();
    google.maps.event.trigger(this.map, 'resize');
    this.locationProvider.getLocation();            //I DON'T KNOW WHY
  }

  // ionViewDidEnter(){
  //   this.platform.ready().then(() => { 
  //     google.maps.event.trigger(this.map, 'resize');
  //     this.showMapAndLocation();
  //    });
  // //   this.showMapAndLocation();
  // }

  showMapAndLocation() {
    
    this.currentLocation.filter((postion) => postion.coords !== undefined) //Filter Out Errors
    .subscribe((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        clickableIcons: false,
        fullscreenControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
     
 
      let userMarker = new google.maps.Marker({
        map: this.map,
        // icon: 'http://maps.google.com/mapfiles/ms/micons/blue.png',
        // icon: 'http://maps.google.com/mapfiles/kml/pal3/icon57.png',
        // icon: 'http://maps.google.com/mapfiles/ms/micons/man.png',
        

        icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
        new google.maps.Size(22, 22),
        new google.maps.Point(0, 18),
        new google.maps.Point(11, 11)),
        position: latLng
      });

      let courts = this.courtProvider.retrieveCourts();

      courts.subscribe(snapshots=>{
          snapshots.forEach(court => {
            new google.maps.Marker({
              map: this.map,
              icon: 'http://maps.google.com/mapfiles/kml/pal3/icon57.png',
              position: new google.maps.LatLng(Number(court.latitude),Number(court.longitude))
            }).addListener('click', this.courtClicked.bind(this,court));                   //To prevent it from calling instantly.
          });
        });
      }, (err) => {
        alert("Map cannot be loaded.");
      });
  }

  courtClicked(court){

    let distance = this.courtProvider.retrieveCourtDistance(court);
    var data = { 
                  Court : court,
                  // courtPic 
                  Distance : distance,
                  Page: "home",
                };
    let modal = this.modalCtrl.create(CourtModalPage, data);
    modal.present();
  }

}

