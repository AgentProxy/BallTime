import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinCourtModalPage } from './join-court-modal';

@NgModule({
  declarations: [
    JoinCourtModalPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinCourtModalPage),
  ],
})
export class JoinCourtModalPageModule {}
