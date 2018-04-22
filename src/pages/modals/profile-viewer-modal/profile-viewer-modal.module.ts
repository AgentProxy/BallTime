import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileViewerModalPage } from './profile-viewer-modal';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    ProfileViewerModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileViewerModalPage),
    ComponentsModule,
  ],
})
export class ProfileViewerModalPageModule {}
