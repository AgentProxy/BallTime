import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapModalPage } from './map-modal';
// import { IonPullUpComponent } from '../../../../node_modules/ionic-pullup/src/ion-pullup';
// import { IonPullUpTabComponent } from '../../../../node_modules/ionic-pullup/src/ion-pullup-tab';
import { IonPullupModule } from 'ionic-pullup';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    MapModalPage,
    
     
  ],
  imports: [
    IonicPageModule.forChild(MapModalPage),
    IonPullupModule,
    ComponentsModule,
  ],
})
export class MapModalPageModule {}
