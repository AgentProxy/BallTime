import { Component } from '@angular/core';

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

  constructor() {
    console.log('Hello PopoverSettingsComponent Component');
    this.text = 'Hello World';
  }

}
