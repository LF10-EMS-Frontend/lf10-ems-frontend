import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";

import {fromEvent, map, filter, Observable, startWith, Subject, switchMap, takeLast, tap} from "rxjs";

import {Employee} from "../Employee";
import {EmployeeService} from "../services/employee.service";
import {Qualification} from "../Qualification";
import {QualificationService} from "../services/qualification.service";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees$: Observable<any>
  searchChange: any = new Subject<string>()
  qualifications$: Observable<Qualification[]>
  filter = new FormControl('')

  constructor(
    private employeeService: EmployeeService,
    private qualificationService: QualificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.qualifications$ = this.qualificationService.fetchQualifications()

    const select = document.querySelector('select.form-select') as HTMLSelectElement;
    const select$ = fromEvent(select, 'change').pipe(
      map(event => event.target as HTMLSelectElement),
      map(select => select.value),
      tap(select => console.log(select)),
    )

    let allEmployees$ = this.employeeService.fetchEmployees()

    let searchedEmployees$ = this.searchChange.pipe(
      startWith(''),
      map((search: string) => search.toLowerCase()),
      // tap((search: string) => console.log("navbar: " + search)),
      switchMap((search: string) => allEmployees$.pipe(
        map((employees: Employee[]) => employees.filter(e => {
        return e.id?.toString().includes(search) ||
          e.firstName?.toLowerCase().includes(search) ||
          e.lastName?.toLowerCase().includes(search)
        }))
      ))
    )

    this.employees$ = select$.pipe(
      startWith('No Filter'),
      switchMap((filter: string) => searchedEmployees$.pipe(
        map((employees: Employee[]) => employees.filter(e => {
          console.log("skillset: " + e.skillSet)
          console.log("filter: " + filter)
          if (filter === "No Filter") { return true }
          return e.skillSet?.includes(filter)
        }))
        )
      )
    )
  }

  // Below are just testing Methods, which will eventually be deleted
  displayEmployee(employee: Employee) {
    // this.router.navigate(['/employee', employee.id]);
    console.log(employee);
  }

  deleteEmployeeEndpoint() {}
    /*
      this.employees$.pipe(
        map((e: Employee[]) => e.slice(0, -1),
        concatMap((lastE: Employee) => this.employeeService)
    }
     */

  postEmployeeEndpoint() {
    let rng: number = Math.floor(Math.random() * 100) + 1;
    const employee = new Employee(
      undefined,
      "Mustermann" + rng,
      "Max" + rng,
      "123 Main St",
      "12345",
      "New York",
      "555-555-5555",
      ["Angular", "TypeScript"],
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
