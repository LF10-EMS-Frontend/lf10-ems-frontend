import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import {Employee} from "../Employee";

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employee?: Employee;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.employeeService.fetchEmployee(Number(id)).subscribe(e => this.employee = e);
  }

}
