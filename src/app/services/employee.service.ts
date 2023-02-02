import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestService } from './request.service';
import { Employee } from '../Employee';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  httpOptions: {headers: HttpHeaders}
  private employees$: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([])
  constructor(private http: HttpClient,
              private requestService: RequestService,
              private errorService: ErrorService) {
    this.httpOptions = this.requestService.getHttpOption();
    this.fetchEmployees();
  }

  public getEmployees(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  public postEmployee(employee: Employee): Observable<string> {
    delete employee.id;
    return this.http
      .post<Employee>('/backend/employees', employee, this.httpOptions)
      .pipe(
        map((result: Employee) => {
          let employees = this.employees$.getValue();
          employees.push(result);
          this.employees$.next(employees);
          return 'Success';
        }),
        catchError((error: any) => {
          console.log('postEmployee Error:');
          console.log(error);
          return ['Invalid Employee modification: ' + error.toString()];
        })
      );
  }

  public putEmployee(employee: Employee): Observable<string> {
    return this.http
      .put<Employee>(
        '/backend/employees/' + employee.id,
        employee,
        this.httpOptions
      )
      .pipe(
        map((result: Employee) => {
          let employees = this.employees$
            .getValue()
            .filter((e: Employee) => e.id !== result.id);
          employees.push(result);
          this.employees$.next(employees);
          return 'Success';
        }),
        catchError((error: any) => {
          console.log('putEmployee Error: ' + error);
          return ['Invalid Employee creation: ' + error.toString()];
        })
      );
  }

  public deleteEmployee(employeeId: number): Observable<string> {
    return this.http
      .delete('/backend/employees/' + employeeId, this.httpOptions)
      .pipe(
        map(() => {
          let employees = this.employees$
            .getValue()
            .filter((e: Employee) => e.id !== employeeId);
          this.employees$.next(employees);
          return 'Success';
        }),
        catchError((error: any) => {
          console.log('deleteEmployee Error: ' + error);
          return ['Invalid Employee deletion: ' + error.toString()];
        })
      );
  }

  private fetchEmployees(): void {
    this.http
      .get<Employee[]>('/backend/employees', this.httpOptions)
      .pipe(
        // catchError(this.errorService.handleError())
        tap((es: Employee[]) => console.log('Employees fetched'))
      )
      .subscribe((es: Employee[]) => this.employees$.next(es));
  }
}
