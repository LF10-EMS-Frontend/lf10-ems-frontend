import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {debounceTime, distinctUntilChanged, tap} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  constructor(private keycloakService: KeycloakService) {
  }
  @Output() searchChange = new EventEmitter<string>();
  searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged()
        // tap(search => console.log("navbar: " + search))
      ).subscribe(search => this.searchChange.emit(search))
  }

  logout(): void {
    this.keycloakService.logout('http://localhost:4200/');
  }
}
