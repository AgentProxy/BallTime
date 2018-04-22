import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing';
import { LoginComponent } from '../../components/login/login';
import { RegisterComponent } from '../../components/register/register';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    LandingPage,
    // LoginComponent,
    // RegisterComponent,
  ],
  imports: [
    IonicPageModule.forChild(LandingPage),
    ComponentsModule,
    
  ],
  entryComponents: [
    RegisterComponent,
  ]
})
export class LandingPageModule {}
