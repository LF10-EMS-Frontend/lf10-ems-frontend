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
      this.router.navigate(['/employee']).then(() => window.location.reload());
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
    if (this.employee.getValue().id) {
      this.employeeService.putEmployee(employee).subscribe();
    } else {
      this.employeeService.postEmployee(employee).subscribe();
    }
    this.router.navigate(['/employee']).then(() => window.location.reload())
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
    //if all empty and id = 0
    //if something changed
    return true;
  }

  openCancelPopup() {
    if (!this.changes()) {
      this.router.navigate(['/employee']).then(() => window.location.reload());
    } else {
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
      };
      const modalRef = this.modalService.open(PopupComponent, ngbModalOptions);
      modalRef.componentInstance.header = 'Warning';
      modalRef.componentInstance.content = 'Do you really want to continue?';
      modalRef.componentInstance.decision = true;
      modalRef.result.then((r) => {
        if (r == true) {
          this.router.navigate(['/employee']).then(() => window.location.reload());
        }
      });
    }
  }

  openDeletePopup() {
    if (!this.changes()) {
      this.router.navigate(['/employee']).then(() => window.location.reload());
    } else {
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
      };
      const modalRef = this.modalService.open(PopupComponent, ngbModalOptions);
      modalRef.componentInstance.header = 'Warning';
      modalRef.componentInstance.content = 'Do you really want to delete this employee?';
      modalRef.componentInstance.decision = true;
      modalRef.result.then((r) => {
        if (r == true) {
          this.employeeService.deleteEmployee(this.employee.value.id!).subscribe(() => {
            this.router.navigate(['/employee']).then(() => window.location.reload());
          });
        }
      });
    }
  }
}
