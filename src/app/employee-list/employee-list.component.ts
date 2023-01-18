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

  //bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzQwMjE1MDcsImlhdCI6MTY3NDAxNzkwNywianRpIjoiOTI2ZmY2NTUtMTQ5ZC00NTI5LThmNWEtOTJjNmUyYTI4YTZmIiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiJmNTJjMGY4My00NmMwLTQ1ZDQtOGJkMy04NzYzMzM2NjI0NWQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.c1BTDxDrPdsQRQKa8KqoocaCWBB51LHo4nQ6lw8vPzZtNgnowsjqpGq20-rYIWMYtuA9XaPX9sRgeQ0IneaEae6xHRw57AZ5SzZ0NQBTGFDf_qHYLsSDYoI5br1DiD-Sa50XARyfi5n9I8XkQx1ntLvc6ekJYTUQOCAtihLnkyzMjiUqEyPHhZLgnLdfWBlQ0Lj9sZ5_WvrqDSFqob_-du1nE8ynph38hiTSRgBTgUfri6EAHyt_WET5g8bSNKr5aq_rHXjvThiuBmBfLpiMj9YHXpG7k3248sA_ad5QMYFYe8iH14KPcWtofZp6U2VDrJubeLhSgdJN63azuTb_rw';
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
