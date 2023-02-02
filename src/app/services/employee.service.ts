import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestService} from "./request.service";
import {Employee} from "../Employee";
import {catchError, Observable} from "rxjs";
import {ErrorService} from "./error.service";
import {Qualification} from "../Qualification";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  httpOptions: {headers: HttpHeaders}
  constructor(private http: HttpClient,
              private requestService: RequestService,
              private errorService: ErrorService) {
    this.httpOptions = this.requestService.getHttpOption();
  }

  public fetchEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>('/backend/employees', this.httpOptions);
  }

  public fetchEmployee(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>('/backend/employees/' + employeeId, this.httpOptions);
  }

  public putEmployee(employee: Employee) {
    if (employee.skillSet) {
      this.checkForUpdatedSkillSet(employee);
    }
    return this.http.put<Employee>(
      '/backend/employees/' + employee.id, employee, this.httpOptions)
      .pipe(catchError(
        this.errorService.handleError<Employee>("putEmployee", employee)));
  }

  public deleteEmployee(employeeId: number) {
    return this.http.delete('/backend/employees/' + employeeId, this.httpOptions)
      .pipe(catchError(
        this.errorService.handleError("deleteEmployee", employeeId)
      ));
  }

  public postEmployee(employee: Employee) {
    return this.http.post<Employee>('/backend/employees', employee, this.httpOptions)
      .pipe(catchError(
        this.errorService.handleError<Employee>('postEmployee', employee)
      ));
  }

  private postQualificationForEmployee(qualification:Qualification, employee:Employee) {
    return this.http.post<Qualification>('/backend/employees/' + employee.id + '/qualifications', qualification, this.httpOptions)
      .pipe(catchError(this.errorService.handleError<Qualification>('postQualificationForEmployee', qualification)));
  }

  private deleteQualificationForEmployee(qualification:Qualification, employee:Employee) {
    const options = {
      headers: this.httpOptions.headers,
      body: qualification
    };
    return this.http.delete<Qualification>('/backend/employees/' + employee.id + '/qualifications', options)
      .pipe(catchError(this.errorService.handleError<Qualification>('deleteQualificationForEmployee', qualification)));
  }

  private checkForUpdatedSkillSet(employee:Employee) {
    this.fetchEmployee(employee.id!).subscribe((e) => {
      let oldEmployee:Employee = e;
      if (!oldEmployee!.skillSet) {
        oldEmployee!.skillSet = [];
      }
      this.checkForNewSkills(oldEmployee!, employee);
      this.checkForRemovedSkills(oldEmployee!, employee);
    });
  }

  private checkForNewSkills(oldEmployee:Employee, employee:Employee) {
    employee.skillSet?.filter(s => !oldEmployee.skillSet?.includes(s)).forEach(s => {
      this.postQualificationForEmployee({skill: s}, employee).subscribe();
    });
  }

  private checkForRemovedSkills(oldEmployee:Employee, employee:Employee) {
    oldEmployee.skillSet!.filter(s => employee.skillSet!.includes(s)).forEach(s => this.deleteQualificationForEmployee({skill:s}, employee));
  }
}
