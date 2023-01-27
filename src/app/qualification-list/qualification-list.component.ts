import {Component, OnInit} from '@angular/core';
import {Qualification} from "../Qualification";
import {QualificationService} from "../services/qualification.service";
import {map, Observable, startWith, Subject, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent implements OnInit {

  qualifications: Qualification[]

  editQualification?: Qualification;
  oldQualificationSkill: string = '';
  searchChange: Subject<string> = new Subject();

  constructor(private qualificationService: QualificationService) {
  }

  ngOnInit() {
    let allQualifications$ = this.qualificationService.fetchQualifications()
    this.searchChange.pipe(
      startWith(''),
      switchMap((search: string) => allQualifications$.pipe(
        map((qualifications: Qualification[]) => qualifications.filter(q =>
          q.skill?.toLowerCase().includes(search.toLowerCase())
        ))
      ))
    ).subscribe(qualifications => this.qualifications = qualifications)
  }

  add(skill: string): void {
    skill = skill.trim();
    if (!skill) {
      return;
    }
    if (this.qualifications.find((q) => {
      return q.skill === skill
    })) {
      alert("This qualification already exists.");
      return;
    }
    this.qualificationService.postQualification({ skill } as Qualification)
      .subscribe(qualification => {
        this.qualifications.push(qualification);
      });
  }

  private update(skill: string): void {
    skill = skill.trim();
    if (!skill) {
      return;
    }
    this.qualificationService.postQualification({ skill } as Qualification)
      .subscribe();
  }

  delete(qualification: Qualification): void {
    this.qualifications = this.qualifications.filter(q => q.skill !== qualification.skill);
    this.qualificationService.deleteQualification(qualification).subscribe();
  }

  edit(qualification: Qualification): void {
    this.oldQualificationSkill = qualification.skill.trim();
    this.editQualification = qualification;
  }

  toEdit(qualification: Qualification): boolean {
    if (!this.editQualification) {
      return false;
    }
    return this.editQualification === qualification;
  }

  cancel(qualification:Qualification):void {
    qualification.skill = this.oldQualificationSkill;
    this.editQualification = undefined;
  }

  save(qualification: Qualification): void {
    if (qualification.skill === this.editQualification!.skill) {
      this.oldQualificationSkill = '';
      this.editQualification = undefined;
      return;
    }
    if (qualification.skill !== '') {
      this.delete({skill: this.oldQualificationSkill} as Qualification);
      this.update(this.editQualification!.skill);
      this.editQualification = undefined;
    } else {
      this.oldQualificationSkill = '';
    }
  }
}
