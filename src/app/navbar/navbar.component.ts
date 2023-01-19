import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private keycloakService: KeycloakService) {
  }

  logout(): void {
    this.keycloakService.logout('http://localhost:4200/');
  }
}
