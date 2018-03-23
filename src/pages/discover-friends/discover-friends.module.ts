import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscoverFriendsPage } from './discover-friends';

@NgModule({
  declarations: [
    DiscoverFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(DiscoverFriendsPage),
  ],
})
export class DiscoverFriendsPageModule {}
