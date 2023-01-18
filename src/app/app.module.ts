import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./utitlity/app.init";

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
