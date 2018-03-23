import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login';
import { IonicPageModule } from 'ionic-angular';
import { IonicModule } from 'ionic-angular';
import { Component } from '@angular/core';
import { RegisterComponent } from './register/register';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth'


@NgModule({
	declarations: [LoginComponent,
	RegisterComponent,
	],
	imports: [ IonicModule,
	AngularFireAuthModule,
	AngularFireAuth,
	],
	exports: [LoginComponent,
    RegisterComponent,
    ]
})
export class ComponentsModule {}
