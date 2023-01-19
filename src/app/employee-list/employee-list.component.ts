import { Component, OnInit } from '@angular/core';
import {Employee} from "../Employee";
import {KeycloakService} from "keycloak-angular";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService, private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.employeeService
      .fetchEmployees()
      .subscribe(employees => this.employees = employees);
  }
}
