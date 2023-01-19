import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {RequestService} from "./request.service";

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  httpOptions: {headers: HttpHeaders};

  constructor(private http: HttpClient, private requestService: RequestService) {
    this.httpOptions = this.requestService.getHttpOption();
  }

  public fetchQualifications():  Observable<Qualification[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', this.httpOptions);
  }

  public postQualification(qualification: Qualification): Observable<Qualification> {
    return this.http.post<Qualification>('/backend/qualifications', qualification, this.httpOptions)
      .pipe(
        catchError(this.handleError<Qualification>('postQualification', qualification))
      );
  }

  deleteQualification(qualification:Qualification): Observable<Qualification> {
    const options = {
      headers: this.httpOptions.headers,
      body: {
        designation: qualification.designation,
      }
    };
    return this.http.delete<Qualification>('/backend/qualifications', options)
      .pipe(
        catchError(this.handleError<Qualification>('deleteQualification', qualification))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation + ':' + error);
      return of(result as T);
    };
  }
}