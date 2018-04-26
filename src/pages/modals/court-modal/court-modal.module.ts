import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourtModalPage } from './court-modal';

@NgModule({
  declarations: [
    CourtModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CourtModalPage),
  ],
})
export class CourtModalPageModule {}
