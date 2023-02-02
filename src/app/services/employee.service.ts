import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestService } from './request.service';
import { Employee } from '../Employee';
import { BehaviorSubject, catchError, map, Observable, tap } from 'rxjs';
import { ErrorService } from './error.service';
import {Qualification} from "../Qualification";

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
          return ['Invalid Employee modification: ' + error.toString()];
        })
      );
  }

  public putEmployee(employee: Employee): Observable<string> {
    if (employee.skillSet) {
      this.checkForUpdatedSkillSet(employee);
    }
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

  public postQualificationForEmployee(qualification:Qualification, employee:Employee) {
    return this.http.post<{id:number, lastName:string, firstName:string, skillSet:[{skill:string}]}>('/backend/employees/' + employee.id + '/qualifications', qualification, this.httpOptions)
      .pipe(catchError(this.errorService.handleError<{id:number, lastName:string, firstName:string, skillSet:[{skill:string}]}>('postQualificationForEmployee', {id:employee.id!, firstName:employee.firstName!, lastName: employee.lastName!, skillSet: [qualification!]})));
  }

  private deleteQualificationForEmployee(qualification:Qualification, employee:Employee) {
    const options = {
      headers: this.httpOptions.headers,
      body: qualification
    };
    return this.http.delete<{id:number, lastName:string, firstName:string, skillSet:[skill:string]}>('/backend/employees/' + employee.id + '/qualifications', options)
      .pipe(catchError(this.errorService.handleError<Qualification>('deleteQualificationForEmployee', qualification)));
  }

  private checkForUpdatedSkillSet(employee:Employee) {
    this.employees$.subscribe((es) => {
      es.forEach(e => {
        if (e.id === employee.id) {
          let oldEmployee:Employee = e;
          if (!oldEmployee.skillSet) {
            oldEmployee.skillSet = [];
          }
          this.checkForNewSkills(oldEmployee, employee);
          this.checkForRemovedSkills(oldEmployee, employee);
        }
      })
    })
  }

  private checkForNewSkills(oldEmployee:Employee, employee:Employee) {
    employee.skillSet?.filter(s => !oldEmployee.skillSet?.includes(s)).forEach(s => {
      this.postQualificationForEmployee({skill: s}, employee).subscribe();
    });
  }

  private checkForRemovedSkills(oldEmployee:Employee, employee:Employee) {
    oldEmployee.skillSet!.filter(s => !employee.skillSet!.includes(s)).forEach(s => {
      this.deleteQualificationForEmployee({skill:s}, employee).subscribe();
    });
  }
}
