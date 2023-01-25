import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Qualification} from "../Qualification";
import {RequestService} from "./request.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  httpOptions: {headers: HttpHeaders};

  constructor(private http: HttpClient,
              private requestService: RequestService,
              private errorService: ErrorService) {
    this.httpOptions = this.requestService.getHttpOption();
  }

  public fetchQualifications():  Observable<Qualification[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', this.httpOptions);
  }

  public postQualification(qualification: Qualification): Observable<Qualification> {
    return this.http.post<Qualification>('/backend/qualifications', qualification, this.httpOptions)
      .pipe(
        catchError(this.errorService.handleError<Qualification>('postQualification', qualification))
      );
  }

  deleteQualification(qualification:Qualification): Observable<Qualification> {
    const options = {
      headers: this.httpOptions.headers,
      body: {
        skill: qualification.skill,
      }
    };
    return this.http.delete<Qualification>('/backend/qualifications', options)
      .pipe(
        catchError(this.errorService.handleError<Qualification>('deleteQualification', qualification))
      );
  }

  updateQualification(oldQualification: Qualification, newQualification: Qualification) {
    this.deleteQualification(oldQualification);
    this.postQualification(newQualification);
  }
}
