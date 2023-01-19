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

  add(designation: string): void {
    designation = designation.trim();
    if (!designation) {
      return;
    }
    this.qualificationService.postQualification({ designation } as Qualification)
      .subscribe(qualification => {
        this.qualifications.push(qualification);
      });
  }

  delete(qualification: Qualification): void {
    this.qualifications = this.qualifications.filter(q => q.designation !== qualification.designation);
    this.qualificationService.deleteQualification(qualification).subscribe();
  }
}
