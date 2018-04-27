import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoginComponent } from './login/login';
import { IonicPageModule } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register';
// import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { LoadingComponent } from './loading/loading';
import { MenuBarComponent } from './menu-bar/menu-bar';

@NgModule({
	declarations: [
	LoginComponent,
	RegisterComponent,
	LoadingComponent,
    MenuBarComponent,
	],
	imports: [ IonicModule,
	// AngularFireAuthModule,
	// AngularFireAuth,
	],
	exports: [
	LoginComponent,
    RegisterComponent,
	LoadingComponent,
    MenuBarComponent,
	],
})
export class ComponentsModule {}
