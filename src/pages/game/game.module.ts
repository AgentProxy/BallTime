import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GamePage } from './game';
import { IonPullupModule } from 'ionic-pullup';

@NgModule({
  declarations: [
    GamePage,
  ],
  imports: [
    IonicPageModule.forChild(GamePage),
    IonPullupModule,
  ],
})
export class GamePageModule {}
