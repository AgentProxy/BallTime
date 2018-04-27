import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../../pages/home/home';
import { ProfilePage } from '../../pages/profile/profile';
import { DiscoverPage } from '../../pages/discover/discover';
import { MessagesPage } from '../../pages/messages/messages';
import { FriendsPage } from '../../pages/friends/friends';
import { Nav } from 'ionic-angular';

/**
 * Generated class for the MenuBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-bar',
  templateUrl: 'menu-bar.html'
})
export class MenuBarComponent {
  @ViewChild(Nav) nav: Nav;
  pages: Array<{title: string, component: any}>;
  
  constructor() {
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Profile', component: ProfilePage},
      { title: 'Discover Courts', component: DiscoverPage},
      { title: 'Messages', component: MessagesPage},
      { title: 'Friends', component: FriendsPage}
    ];
  }

  openPage(page){
    if(page.title == "Home"){
      // this.nav.push(page.component);
      this.nav.setRoot(page.component);
      // alert("you're home!")
    }
    else{
      this.nav.push(page.component);
    }
  }

}
