import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinCourtModalPage } from './join-court-modal';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    JoinCourtModalPage,
  ],
  imports: [
    IonicPageModule.forChild(JoinCourtModalPage),
    ComponentsModule,
  ],
})
export class JoinCourtModalPageModule {}
