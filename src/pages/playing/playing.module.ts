import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayingPage } from './playing';

@NgModule({
  declarations: [
    PlayingPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayingPage),
  ],
})
export class PlayingPageModule {}
