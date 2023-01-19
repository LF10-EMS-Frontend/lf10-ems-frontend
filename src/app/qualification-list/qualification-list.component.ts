import {Component, OnInit} from '@angular/core';
import {Qualification} from "../Qualification";
import {QualificationService} from "../services/qualification.service";

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent implements OnInit {

  qualifications: Qualification[] = [];

  editQualification?: Qualification;
  oldQualificationSkill: String = '';

  constructor(private qualificationService: QualificationService) {
  }

  ngOnInit() {
    this.getQualifications();
  }

  private getQualifications(): void {
    this.qualificationService
      .fetchQualifications()
      .subscribe(qualifications => this.qualifications = qualifications);
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

  cancel():void {
    this.editQualification = undefined;
  }

  save(qualification: Qualification): void {
    if (qualification.skill !== '') {
      this.delete({skill: this.oldQualificationSkill} as Qualification);
      this.update(this.editQualification!.skill);
      this.editQualification = undefined;
    } else {
      this.oldQualificationSkill = '';
    }
  }
}
