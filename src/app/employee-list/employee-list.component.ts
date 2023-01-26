import { Component, OnInit } from '@angular/core';
import {Employee} from "../Employee";
import {EmployeeService} from "../services/employee.service";
import {Router} from "@angular/router";
import {map, Observable, startWith, Subject, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = []
  allEmployees$: Observable<Employee[]>
  filteredEmployees$: Observable<Employee[]>
  searchChange: any = new Subject<string>()

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.allEmployees$ = this.allEmployees$ = this.employeeService.fetchEmployees();

    this.filteredEmployees$ = this.searchChange.pipe(
      startWith(''),
      map((search: string) => search.toLowerCase()),
      // tap((search: string) => console.log("navbar: " + search)),
      switchMap((search: string) => this.allEmployees$.pipe(
        map((employees: Employee[]) => employees.filter(e => {
        return e.id?.toString().includes(search) ||
          e.firstName?.toLowerCase().includes(search) ||
          e.lastName?.toLowerCase().includes(search)
        }))
      ))
    )

    this.filteredEmployees$.subscribe(employees => this.employees = employees)
  }

  // Below are just testing Methods, which will eventually be deleted
  displayEmployee(employee: Employee) {
    // this.router.navigate(['/employee', employee.id]);
    console.log(employee);
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
