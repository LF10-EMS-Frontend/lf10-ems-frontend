import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, map, Observable, tap} from "rxjs";
import {Qualification} from "../Qualification";
import {RequestService} from "./request.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class QualificationService {

  httpOptions: {headers: HttpHeaders};
  qualifications$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

  constructor(private http: HttpClient,
              private requestService: RequestService,
              private errorService: ErrorService) {
    this.httpOptions = this.requestService.getHttpOption();
    this.fetchQualifications()
  }

  public fetchQualifications(): void {
    this.http.get<Qualification[]>('/backend/qualifications', this.httpOptions).pipe(
      map((qs: Qualification[]) => qs.map((q: Qualification) => q.skill)),
      tap(skills => console.log('fetchQualifications: ' + skills))
    ).subscribe((skills: string[]) => this.qualifications$.next(skills))
  }

  public getQualifications():  Observable<string[]> {
    return this.qualifications$.asObservable()
  }

  public postQualification(_skill: string): void {
    let skill = _skill.trim()
    if (skill === '') { return }  // TODO: throw Error

    let qualifications: string[] = this.qualifications$.getValue()
    if (qualifications.includes(skill)) {
      // TODO: throw Error
      alert("This qualification already exists.");
      return;
    }
    this.http.post<Qualification>(
      '/backend/qualifications', new Qualification(skill), this.httpOptions
    ).pipe(
      catchError(this.errorService.handleError<Qualification>('postQualification', new Qualification(skill))),
      map((qualification: Qualification) => qualification.skill)
    ).subscribe((skill: string) => {
      qualifications.push(skill)
      this.qualifications$.next(qualifications);
      return
    })
  }

  deleteQualification(skill: string): void {
    const options = {
      headers: this.httpOptions.headers,
      body: {
        skill: skill,
      }
    };
    // TODO: I don't think delete actually returns a Qualification :thinking:
    //  Swagger says that you only get a response Code
    this.http.delete<Qualification>('/backend/qualifications', options).pipe(
      catchError(this.errorService.handleError<Qualification>('deleteQualification', new Qualification(skill)))
    ).subscribe();
    this.qualifications$.next(
      this.qualifications$.getValue().filter((s: string) => s !== skill)
    )
  }

  updateQualification(oldSkill: string, _newSkill: string) {
    let newSkill = _newSkill.trim()
    if (newSkill === '') { return }  // TODO: throw Error

    this.deleteQualification(oldSkill);
    this.postQualification(newSkill);
  }
}
