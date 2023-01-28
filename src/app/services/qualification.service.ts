import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
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

  public fetchQualifications():  Observable<string[]> {
    return this.http.get<Qualification[]>('/backend/qualifications', this.httpOptions).pipe(
      map((q: Qualification[]) => q.map((e: Qualification) => e.skill))
    );
  }

  public postQualification(qualification: string): Observable<string> {
    return this.http.post<Qualification>('/backend/qualifications', new Qualification(qualification), this.httpOptions)
      .pipe(
        catchError(this.errorService.handleError<Qualification>('postQualification', new Qualification(qualification))),
        map((qualification: Qualification) => qualification.skill)
  );
  }

  deleteQualification(qualification: string): Observable<Qualification> {
    const options = {
      headers: this.httpOptions.headers,
      body: {
        skill: qualification,
      }
    };
    // TODO: I don't think delete actually returns a Qualification :thinking:
    //  Swagger says that you only get a response Code
    return this.http.delete<Qualification>('/backend/qualifications', options)
      .pipe(
        catchError(this.errorService.handleError<Qualification>('deleteQualification', new Qualification(qualification)))
      );
  }

  updateQualification(oldQualification: string, newQualification: string) {
    this.deleteQualification(oldQualification);
    this.postQualification(newQualification);
  }
}
