import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../components/components.module';

// import { ComponentsModule } from '../../components/components.module';
// import { Component } from '@angular/core';
@IonicPage()
@NgModule({
  declarations: [
    ProfilePage,
    // LoadingComponent,

  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    ComponentsModule,
    
  ],
  
})
export class ProfilePageModule {}
