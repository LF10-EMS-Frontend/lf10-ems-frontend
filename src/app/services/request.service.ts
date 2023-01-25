import { Injectable } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../Employee";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private bearer: string = '';
  private httpOptions = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.bearer}`)
  };

  constructor(private keycloakService: KeycloakService, private http: HttpClient) {
    this.initializeUserOptions();
  }

  private initializeUserOptions() {
    this.initBearerToken();
  }

  public getHttpOption(): {headers: HttpHeaders} {
    if (this.bearer === '') {
      this.initializeUserOptions();
    }
    return this.httpOptions;
  }

  private async initBearerToken() {
    this.bearer = await this.keycloakService.getToken();
  }
}
