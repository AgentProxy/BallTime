import { NgModule } from '@angular/core';
import { IonicPageModule, IonicPage } from 'ionic-angular';
import { HomePage } from './home';
// import { LoadingComponent } from '../../components/loading/loading';
import { ComponentsModule } from '../../components/components.module';


@IonicPage()
@NgModule({
  declarations: [
    HomePage,
    // LoadingComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    ComponentsModule,
  ],
})
export class HomePageModule {}
