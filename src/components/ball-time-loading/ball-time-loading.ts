import { Component } from '@angular/core';

/**
 * Generated class for the BallTimeLoadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ball-time-loading',
  templateUrl: 'ball-time-loading.html'
})
export class BallTimeLoadingComponent {

  text: string;

  constructor() {
    console.log('Hello BallTimeLoadingComponent Component');
    this.text = 'Hello World';
  }

}
