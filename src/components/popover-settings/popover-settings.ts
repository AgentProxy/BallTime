import { Component } from '@angular/core';
import { CourtProvider } from '../../providers/court/court';
import { NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the PopoverSettingsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-settings',
  templateUrl: 'popover-settings.html'
})
export class PopoverSettingsComponent {

  text: string;
  value: Number;
  courtId: any;
  startTime: any;

  constructor(private courtProvider: CourtProvider, private navParams: NavParams, private alertCtrl: AlertController) {
    this.courtId = this.navParams.get('courtId');
  }

  changePlayersAllowed(){
    this.courtProvider.changePlayersAllowed(this.value, this.courtId);
  }

  changeStartTime(){
    this.changePlayersAllowed();
    this.startTime;
    this.courtProvider.changeStartTime(this.startTime, this.courtId);
  }

}
