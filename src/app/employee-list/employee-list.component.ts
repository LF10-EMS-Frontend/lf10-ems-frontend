import { Component, OnInit } from '@angular/core';
import {Employee} from "../Employee";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    this.getEmployees();
  }

  private getEmployees(): void {
    this.employeeService
      .fetchEmployees()
      .subscribe(employees => this.employees = employees);
  }

  deleteEmployeeEndpoint() {
    let employee = this.employees.pop();
    this.employeeService.deleteEmployee(employee!.id!)
      .subscribe();
  }
  postEmployeeEndpoint() {
    let rng: number = Math.floor(Math.random() * 100) + 1;
    const employee = new Employee(
      undefined,
      "doe" + rng,
      "John" + rng,
      "123 Main St",
      "12345",
      "New York",
      "555-555-5555",
      ["Java"],
    )
    console.log(employee);
    this.employeeService
      .postEmployee(employee).subscribe();
  }

  putEmployeeEndpoint() {
    let rng: number = Math.floor(Math.random() * 100) + 1;
    const employee = new Employee(
      3,
      "doe" + rng,
      "John" + rng,
      "123 Main St",
      "12345",
      "New York",
      "555-555-5555",
      ["Java", "Angular"],
    );
    console.log(employee);

    this.employeeService.putEmployee(employee).subscribe();
  }
}
