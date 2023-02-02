import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { combineLatest, map, Observable, startWith, Subject } from 'rxjs';

import { Employee } from '../Employee';
import { EmployeeService } from '../services/employee.service';
import { QualificationService } from '../services/qualification.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees$: Observable<Employee[]>;
  qualifications$: Observable<string[]>;
  selection$: FormControl<string[]> = new FormControl();
  search$: Subject<string> = new Subject<string>();

  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.qualifications$ = this.qualificationService.getQualifications();

    this.employees$ = combineLatest(
      this.selection$.valueChanges.pipe(startWith([])),
      this.search$.pipe(startWith('')),
      this.employeeService.getEmployees()
    ).pipe(
      // tap(stuff => console.log(stuff)),
      map(([selection, search, employees]) =>
        this.filterFunction(selection, search, employees)
      )
    );
    this.employees$.subscribe((data) => console.log('subscription: ' + data));
  }

  filterFunction(selection: string[], _search: string, employees: Employee[]) {
    let search = _search.toLowerCase();
    console.log('filterFunction selection: ' + selection + 'search: ' + search);
    return employees
      .filter((employee) => {
        return (
          employee.id?.toString().includes(search) ||
          employee.firstName?.toLowerCase().includes(search) ||
          employee.lastName?.toLowerCase().includes(search)
        )
      }).filter((employee: Employee) => {
        if (selection.length === 0) {return true}
        if (employee.skillSet === undefined) {return false}
        return selection.every(val => employee.skillSet!.includes(val))
    })
  }

  // Below are just testing Methods, which will eventually be deleted
  displayEmployee(employee: Employee) {
    this.router.navigate(['/employee/' + employee.id]).then()
  }

  deleteEmployeeEndpoint() {
    this.employeeService.deleteEmployee(3)
      .subscribe( e => {
        console.log("Employee-list delete error:");
        console.log(e)
      })
  }

  postEmployeeEndpoint() {
    let rng: number = Math.floor(Math.random() * 100) + 1;
    const employee = new Employee(
      // ['Java', 'Blabla']
      ['Angular', 'TypeScript'],
      undefined,
      'Mustermann' + rng,
      'Max' + rng,
      '123 Main St',
      '12345',
      'New York',
      '555-555-5555',
    );
    console.log(employee);
    this.employeeService
      .postEmployee(employee)
      .subscribe((message: string) =>
        console.log('employee-list received: ' + message)
      );
  }

  putEmployeeEndpoint() {
    let rng: number = Math.floor(Math.random() * 100) + 1;
    const employee = new Employee(
      ['Java', 'Angular', 'TypeScript'],
      3,
      'doe' + rng,
      'John' + rng,
      '123 Main St',
      '12345',
      'New York',
      '555-555-5555',
    );
    console.log(employee);

    this.employeeService
      .putEmployee(employee)
      .subscribe((message: string) =>
        console.log('employee-list received: ' + message)
      );
  }
}
