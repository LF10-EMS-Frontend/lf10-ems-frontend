import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import {Employee} from "../Employee";
import {QualificationService} from "../services/qualification.service";
import {BehaviorSubject, map, Observable, switchMap, tap} from "rxjs";

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
    private qualificationService:QualificationService
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
      // this.employeeSkills.next(this.employee.getValue().skillSet!)
    }
    if (isNaN(+id)) {
      console.log(id)
      this.router.navigate(['/employee']).then();
      return
    }
    this.employeeService.getEmployees().subscribe((es: Employee[]) => {
      this.employee.next(es.find((e: Employee) => e.id === +id)!);
    })
  }

  save(employee:Employee):void {
    if (this.employee.getValue().id) {
      this.employeeService.putEmployee(employee).subscribe();
    } else {
      this.employeeService.postEmployee(employee).subscribe();
    }
    this.router.navigate(['/employee']).then()
  }

  deleteSkillFromEmployee(skill:String) {
    let employee = this.employee.getValue()
    employee.skillSet = employee.skillSet!.filter((s) => s !== skill);
    this.employee.next(employee)
  }

  cancel() {
    this.router.navigate(['/employee']).then();
  }

  addSkill() {
    if (!this.employee.getValue().skillSet.includes(this.selectedSkill!)) {
      let employee = this.employee.getValue()
      employee.skillSet.push(this.selectedSkill!)
      this.employee.next(employee)
    }
    this.selectedSkill = "";
  }

  createQualification() {
    if (this.newSkill) {
      this.qualificationService.postQualification(this.newSkill);
      this.newSkill = "";
    }
  }
}
