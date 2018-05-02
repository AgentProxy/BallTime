import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, FabContainer, AlertController } from 'ionic-angular';
import { LocationServiceProvider } from '../../../providers/location-service/location-service';
import { GoogleFunctionsProvider } from '../../../providers/google-functions/google-functions';
import { IonPullUpFooterState } from 'ionic-pullup';
import { UserProvider } from '../../../providers/user/user';

declare var google;
/**
 * Generated class for the MapModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {

  @ViewChild('map') mapRef: ElementRef;
  map: any;
  currentLocation : any;
  choice: string;
  court: any;
  footerState: IonPullUpFooterState;
  mode:string = 'WALKING';
  icon:string = 'walk';
  showJoin:boolean = true;
  userLocation: any;

  
  constructor(private locationProvider: LocationServiceProvider, private viewCtrl: ViewController, private alertCtrl: AlertController, private navParams: NavParams, private userProvider: UserProvider) {
    this.currentLocation = this.locationProvider.getUpdatedLocation();
    this.court = navParams.get('Court');
    this.footerState = IonPullUpFooterState.Collapsed;
    
    

    if(this.navParams.get('Page')!="home" && this.navParams.get('Page')!="join"){
      this.mode = this.navParams.get('Mode');
    }
    else{}

    if(this.navParams.get('Page')=='join'||this.navParams.get('Page')=='game'){
      this.showJoin = false;
    }
    else{}
  }


  ionViewDidLoad(){
    this.showMap(this.court);
  }

  changeMode(mode,icon,fab: FabContainer){
    fab.close();
    this.mode = mode;
    this.icon = icon;
    document.getElementById("mapPanel").innerHTML = "";
    this.showMap(this.court);
    
  }

  async showMap(court){
    this.userLocation = await this.userProvider.retrieveUserLocation();
    let latLng = new google.maps.LatLng(this.userLocation.latitude,this.userLocation.longitude);      //TO CHANGE
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

    let courtMarker = new google.maps.Marker({
      map: this.map,
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon57.png',
      position: new google.maps.LatLng(Number(court.latitude),Number(court.longitude))
    });
  
    this.drawDirection(court, this.map);
  }

 

  drawDirection(court, map){
    let alertController = this.alertCtrl;
    var stepDisplay = new google.maps.InfoWindow;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    let markerArray = [];

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('mapPanel'));

    switch(this.mode){
      case "WALKING":
        this.icon = "walk";
        break;
      case "BICYCLING":
        this.icon = "bicycle";
        break;
      case "DRIVING":
        this.icon = 'car';
        break;
      default:
        this.icon = "walk";

    }

    var request = {
      origin: new google.maps.LatLng(this.userLocation.latitude, this.userLocation.longitude),        //TO CHANGE
      destination: new google.maps.LatLng(court.latitude, court.longitude),
      travelMode: google.maps.TravelMode[this.mode],                          //TO CHANGE
    };

    directionsService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
        showSteps(result, markerArray, stepDisplay,map);
      }
      else{
        console.log(result);
        showNoRoute();
      }
    }); 

    function showNoRoute() {
      let alert = alertController.create({
        title: 'No Routes Found for this mode of transportation',
        subTitle: 'Please choose another mode of transportation. We\'re sorry',
        buttons: ['OK']
      });
      alert.present();

    }

    function showSteps(directionResult, markerArray, stepDisplay, map) {
      var myRoute = directionResult.routes[0].legs[0];
      for (var i = 0; i < myRoute.steps.length; i++) {
        var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
        marker.setMap(map);
        marker.setPosition(myRoute.steps[i].start_location);
        attachInstructionText(stepDisplay, marker, myRoute.steps[i].instructions, map);
      }
    }

    function attachInstructionText(stepDisplay, marker, text, map){
      google.maps.event.addListener(marker, 'click', function() {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
      });
    }

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  //FOOTER FUNCTIONS
  footerExpanded() {
    // console.log('Footer expanded!');
  }

  footerCollapsed() {
    // console.log('Footer collapsed!');
  }

  toggleFooter() {
    this.footerState = this.footerState == IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }
}
