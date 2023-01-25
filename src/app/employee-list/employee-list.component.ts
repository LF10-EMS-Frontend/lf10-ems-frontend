import { Component, OnInit } from '@angular/core';
import {Employee} from "../Employee";
import {KeycloakService} from "keycloak-angular";
import {RequestService} from "../services/request.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private requestService:RequestService, private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.requestService
      .fetchEmployees()
      .subscribe(employees => this.employees = employees);
  }
}
