import { Component } from '@angular/core';
import {Observable, of} from "rxjs";
import {Employee} from "../Employee";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

  bearer = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzUFQ0dldiNno5MnlQWk1EWnBqT1U0RjFVN0lwNi1ELUlqQWVGczJPbGU0In0.eyJleHAiOjE2NzM1MjIwNjYsImlhdCI6MTY3MzUxODQ2NiwianRpIjoiMjBjNzE4MTEtYTNhNS00NDIzLWI3ODUtNjQ2YTc3NDJkMzc2IiwiaXNzIjoiaHR0cHM6Ly9rZXljbG9hay5zenV0LmRldi9hdXRoL3JlYWxtcy9zenV0IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjU1NDZjZDIxLTk4NTQtNDMyZi1hNDY3LTRkZTNlZWRmNTg4OSIsInR5cCI6IkJlYXJlciIsImF6cCI6ImVtcGxveWVlLW1hbmFnZW1lbnQtc2VydmljZSIsInNlc3Npb25fc3RhdGUiOiIyMzU3NWY4Zi02ZTczLTQ2M2ItODBkZi04YzIyZTliYjE3MWYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1zenV0IiwidW1hX2F1dGhvcml6YXRpb24iLCJ1c2VyIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6InVzZXIifQ.bNd-aZl1tByK6Ek7-vQGlb197PyxgwJTmfgvNRrmq5bLbIfIo-A2wjLcgfa7AMjeco6ov7HVhJjp78reqyRrjnIdFGokJHfxBZKuTx-9F72kGl-qRvJ6jPai54S6X3-jIr4FhV29rcboj0LfjI0_WJfLN3IxC7bh9IaW8nl4QzG47xQF7Zv7vqz7uJAKKGGYIHo9KwbuGcYoPrJF_05-xFhP5lQDs9f8Bp3a1iYUOMrA7-5KcvFLR4_j6p2VOZN0FvsGIkANj8gTsLxjfNiOKMuLROw_7jvYoiSpbebHoRfl2wwGtjxOGm8YhKboKzj8w5InoIXrpwZq03dLllYlYw';
  employees$: Observable<Employee[]>;

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.bearer}`)
    });
  }

}
