import {Component, OnInit} from '@angular/core';
import {Employee} from "../Employee";
import {EmployeeService} from "../services/employee.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements  OnInit {

  employee?: Employee;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeService.fetchEmployee(Number(id)).subscribe(e => this.employee = e);
  }

}
