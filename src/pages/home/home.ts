import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController, MenuController } from 'ionic-angular';
import { LocationServiceProvider } from '../../providers/location-service/location-service';
import { CourtProvider } from '../../providers/court/court';
import { AlertController } from 'ionic-angular';
import { CourtModalPage } from '../modals/court-modal/court-modal';
import { Court } from '../../models/court/court.model';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserProvider } from '../../providers/user/user';


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
  showLoading: boolean = true;
  subscription: any;

  constructor(platform: Platform,  public navCtrl: NavController, public navParams: NavParams,
      private locationProvider: LocationServiceProvider, private courtProvider: CourtProvider,
      private alertCtrl: AlertController, private modalCtrl: ModalController, private menuCtrl: MenuController, private geo: Geolocation, private userProvider: UserProvider ){
          // this.currentLocation = this.locationProvider.getUpdatedLocation();
          this.platform = platform;
          google.maps.event.trigger(this.map, 'resize');
          
          this.showMapAndLocation();
    }

  ionViewCanEnter(){
    
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
  }

 
  async showMapAndLocation() {
    this.subscription =  this.locationProvider.getUpdatedLocation()//Filter Out Errors
    .subscribe((position) => {
      if(position.coords.accuracy>100){
        console.log(position.coords.accuracy);
        this.subscription.unsubscribe();
        this.showMapAndLocation();
        return;
      }
      else{
        this.userProvider.updateUserLocation(position);
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
          icon: new google.maps.MarkerImage('http://maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
          new google.maps.Size(22, 22),
          new google.maps.Point(0, 18),
          new google.maps.Point(11, 11)),
          position: latLng
        });
        let courts = this.courtProvider.retrieveCourts().snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Court;
            const id = a.payload.doc.id;
            return { id, ...data };
          }); 
        });
        courts.subscribe(snapshots=>{
            snapshots.forEach(court => {
              new google.maps.Marker({
                map: this.map,
                icon: 'http://maps.google.com/mapfiles/kml/pal3/icon57.png',
                position: new google.maps.LatLng(Number(court.latitude),Number(court.longitude))
              }).addListener('click', this.courtClicked.bind(this,court));                   //To prevent it from calling instantly.
            });
          });
          this.showLoading = false;
        }
      }
      , (err) => {
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

  ionViewDidLeave(){
    this.subscription.unsubscribe();
    console.log('Bye homepage');
  }


}

