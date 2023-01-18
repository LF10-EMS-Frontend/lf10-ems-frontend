import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  bearer:String = '';
  employees$: Observable<Employee[]>;
  user:String = '';

  constructor(private http: HttpClient, private keycloakService: KeycloakService) {
    this.employees$ = of([]);
    this.fetchData();
  }

  ngOnInit(): void {
    this.initializeUserOptions();
  }

  private initializeUserOptions() {
    this.user = this.keycloakService.getUsername();
    this.initBearerToken();
  }

  private async initBearerToken() {
    this.bearer = await this.keycloakService.getToken();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

  logout(): void {
    this.keycloakService.logout('http://localhost:4200/');
  }
}
