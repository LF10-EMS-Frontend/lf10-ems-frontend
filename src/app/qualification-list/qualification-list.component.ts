import {Component, OnInit} from '@angular/core';
import {QualificationService} from "../services/qualification.service";
import {BehaviorSubject, map, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";

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
    this.qualificationService.fetchQualifications()
      .subscribe((qs: string[]) => this.allQualifications$.next(qs)
    )
    this.qualifications$ = this.searchChange.pipe(
      startWith(''),
      map((s: string) => s.toLowerCase()),
      // tap((s: string) => console.log("searchChange: " + s)),
      switchMap((search: string) => this.allQualifications$.pipe(
        map((skills: string[]) => skills.filter((skill: string) =>
          skill?.toLowerCase().includes(search)
        ))
      )),
      // tap((skills: string[]) => console.log("filteredList: " + skills))
    )
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
    this.qualificationService.deleteQualification(qualification).subscribe();
    this.allQualifications$.pipe(
      map((qs: string[]) => qs.filter((q: string) => q !==qualification))
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
