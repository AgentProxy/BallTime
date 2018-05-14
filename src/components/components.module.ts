import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login/login';
import { IonicPageModule } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { LoadingComponent } from './loading/loading';
import { PopoverSettingsComponent } from './popover-settings/popover-settings';

@NgModule({
	declarations: [
	LoginComponent,
	RegisterComponent,
	LoadingComponent,
    PopoverSettingsComponent,
	],
	imports: [ IonicModule,
	// AngularFireAuthModule,
	// AngularFireAuth,
	],
	exports: [
	LoginComponent,
    RegisterComponent,
	LoadingComponent,
    PopoverSettingsComponent,
	],
})
export class ComponentsModule {}
