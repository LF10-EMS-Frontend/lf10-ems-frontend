import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import {Employee} from "../Employee";
import {QualificationService} from "../services/qualification.service";
import {BehaviorSubject, map, Observable, skip, switchMap} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {PopupComponent} from "../popup/popup.component";

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})

export class EmployeeDetailsComponent implements OnInit {
  employee: BehaviorSubject<Employee> = new BehaviorSubject<Employee>(new Employee([]));
  qualifications: Observable<string[]>
  selectedSkill?: string;
  newSkill?:string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private qualificationService:QualificationService,
    private modalService:NgbModal
  ) {}

  ngOnInit(): void {
    this.qualifications = this.employee.pipe(
      map((e: Employee) => e.skillSet),
      switchMap((employeeSkills: string[]) => this.qualificationService.getQualifications().pipe(
        map((allSkills: string[]) => allSkills
          .filter((skill: string) => !employeeSkills.includes(skill))
        ),
        map((qs: string[]) => qs.sort())
      ))
    );
    let id: string = this.route.snapshot.paramMap.get('id')!;
    if (id === "new") {
      return
    }
    if (isNaN(+id)) {
      this.router.navigate(['/employee']).then();
      return
    }
    this.employeeService.getEmployees().pipe(skip(1)).subscribe((es: Employee[]) => {
      if (!es.find((e: Employee) => e.id === +id)) {
        this.router.navigate(['/employee']).then();
      }
      this.employee.next(es.find((e: Employee) => e.id === +id)!);
    });
  }

  save(employee:Employee):void {
    this.openSaveConfirmation(employee);
  }

  deleteSkillFromEmployee(skill:String) {
    let employee = this.employee.getValue()
    employee.skillSet = employee.skillSet!.filter((s) => s !== skill);
    this.employee.next(employee);
  }

  cancel() {
    this.openCancelPopup();
  }

  delete () {
    this.openDeletePopup();
  }

  addSkill() {
    if (!this.employee.getValue().skillSet.includes(this.selectedSkill!)) {
      let employee = this.employee.getValue();
      employee.skillSet.push(this.selectedSkill!);
      this.employee.next(employee);
    }
    this.selectedSkill = "";
  }

  createQualification() {
    if (this.newSkill) {
      this.qualificationService.postQualification(this.newSkill);
      this.selectedSkill = this.newSkill;
      this.addSkill();
      this.newSkill = "";
    }
  }

  changes(): boolean {
    return !((!this.employee.getValue().id || this.employee.getValue().id === 0) &&
      !this.employee.getValue().firstName &&
      !this.employee.getValue().lastName &&
      !this.employee.getValue().street &&
      !this.employee.getValue().postcode &&
      !this.employee.getValue().city &&
      !this.employee.getValue().phone &&
      this.employee.getValue().skillSet.length === 0);
  }

  openSaveConfirmation(employee:Employee) {
    this.openPopup('Save confirmation', 'Do you really want to save your changes?').then((r) => {
      if (r) {
        if (this.employee.getValue().id) {
          this.employeeService.putEmployee(employee).subscribe();
        } else {
          this.employeeService.postEmployee(employee).subscribe();
        }
        this.router.navigate(['/employee']).then()
      }
    });
  }

  openCancelPopup() {
    if (!this.changes()) {
      this.router.navigate(['/employee']).then();
    } else {
      this.openPopup('Leave confirmation', 'Do you really want to leave without saving?').then((r) => {
        if (r) {
          this.router.navigate(['/employee']).then();
        }
      });
    }
  }

  openDeletePopup() {
    if (!this.changes()) {
      this.router.navigate(['/employee']).then();
    } else {
      this.openPopup('Delete confirmation', 'Do you really want to delete this employee?').then((r) => {
        if (r) {
          this.employeeService.deleteEmployee(this.employee.value.id!).subscribe(() => {
            this.router.navigate(['/employee']).then();
          });
        }
      });
    }
  }

  openPopup(header:string, content:string): Promise<any> {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    const modalRef = this.modalService.open(PopupComponent, ngbModalOptions);
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.decision = true;
    return modalRef.result;
  }
}
