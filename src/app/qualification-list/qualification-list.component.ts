import {Component, OnInit} from '@angular/core';
import {QualificationService} from "../services/qualification.service";
import {map, Observable, startWith, Subject, switchMap} from "rxjs";
import {PopupComponent} from "../popup/popup.component";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-qualification-list',
  templateUrl: './qualification-list.component.html',
  styleUrls: ['./qualification-list.component.css']
})
export class QualificationListComponent implements OnInit {

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
      switchMap((search: string) => this.qualificationService.getQualifications().pipe(
        map((skills: string[]) => this.filterFunction(skills, search)),
  )),
    )
  }

  filterFunction(qualifications: string[], search: string): string[] {
    return qualifications.filter((q: string) => {
      return q?.toLowerCase().includes(search.toLowerCase())
    })
  }

  toEdit(quali: string): boolean {
    return this.editQualificationOld === quali
  }

  edit(qualification: string): void {
    this.editQualificationOld = qualification;
    this.editQualificationNew = qualification;
  }

  cancel(qualification: string):void {
    this.editQualificationOld = undefined;
  }

  add(skill: string): void {
    skill = skill.trim();
    if (!skill) {return}
    this.qualificationService.postQualification(skill)
  }

  delete(qualification: string): void {
    this.qualificationService.deleteQualification(qualification)
  }

  save(skill: string): void {
    if (skill !== this.editQualificationOld! && skill !== '') {
      this.qualificationService.updateQualification(this.editQualificationOld!, skill)
    }
    this.editQualificationOld = undefined;
  }
}
