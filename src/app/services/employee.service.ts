import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RequestService} from "./request.service";
import {Employee} from "../Employee";
import {catchError, Observable} from "rxjs";
import {ErrorService} from "./error.service";

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

  public putEmployee(employee: Employee) {
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
    delete employee.id
    return this.http.post<Employee>("/backend/employees", employee, this.httpOptions)
      .pipe(catchError(
        this.errorService.handleError<Employee>("postEmployee", employee)
      ));
  }
}
