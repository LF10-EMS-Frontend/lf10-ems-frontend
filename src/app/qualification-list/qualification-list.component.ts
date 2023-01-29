import {Component, OnInit} from '@angular/core';
import {QualificationService} from "../services/qualification.service";
import {BehaviorSubject, map, Observable, startWith, Subject, switchMap, tap} from "rxjs";

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent implements OnInit {

  allQualifications$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])
  qualifications$: Observable<string[]>
  editQualificationOld?: string;
  editQualificationNew: string;
  searchChange: Subject<string> = new Subject();

  constructor(private qualificationService: QualificationService) {
  }

  ngOnInit() {
    this.qualifications$ = this.searchChange.pipe(
      startWith(''),
      // tap((s: string) => console.log("searchChange: " + s)),
      switchMap((search: string) => this.qualificationService.fetchQualifications().pipe(
        map((skills: string[]) => this.filterFunction(skills, search))
      )),
      // tap((skills: string[]) => console.log("filteredList: " + skills))
    )
  }

  filterFunction(qualifications: string[], search: string): string[] {
    return qualifications.filter((q: string) => {
      q?.toLowerCase().includes(search.toLowerCase())
    })
  }

  toEdit(quali: string): boolean {
    return this.editQualificationOld === quali
  }

  add(skill: string): void {
    skill = skill.trim();
    if (!skill) {
      return;
    }
    let qualifications: string[] = this.allQualifications$.getValue()
    if (qualifications.includes(skill)) {
      alert("This qualification already exists.");
      return;
    }
    this.qualificationService.postQualification(skill)
      .subscribe(() => {
        qualifications.push(skill)
        this.allQualifications$.next(qualifications);
        return
      })
    return
  }

  delete(qualification: string): void {
    this.qualificationService.deleteQualification(qualification)
      .subscribe();
    this.allQualifications$.next(
      this.allQualifications$.getValue().filter((q: string) => q !== qualification)
    )
  }

  edit(qualification: string): void {
    this.editQualificationOld = qualification;
    this.editQualificationNew = qualification;
  }

  cancel(qualification: string):void {
    this.editQualificationOld = undefined;
  }

  save(qualification: string): void {
    if (qualification === this.editQualificationOld! || qualification === '') {
      this.editQualificationOld = undefined;
      return;
    }
    this.delete(this.editQualificationOld!);
    this.qualificationService.postQualification(qualification)
      .subscribe();
    this.editQualificationOld = undefined;
  }
}
