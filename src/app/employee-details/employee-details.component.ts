import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import {Employee} from "../Employee";
import {QualificationService} from "../services/qualification.service";
import {Qualification} from "../Qualification";

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  employee?: Employee;
  qualifications: Qualification[] = [];
  selectedSkill?: string;
  newSkill?:string;

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService, private qualificationService:QualificationService) {
  }

  ngOnInit(): void {
    let id = +this.route.snapshot.paramMap.get('id')!;
    if (!isNaN(id)) {
      if (id !== 0) {
        this.employeeService.fetchEmployee(id).subscribe(e => this.employee = e);
      } else {
        this.employee = new Employee();
      }
      this.qualificationService
        .fetchQualifications()
        .subscribe(qualifications => this.qualifications = qualifications);
    } else {
      this.router.navigate(['/employee']).then();
    }
  }

  save(employee:Employee):void {
    if (this.employee?.id) {
      this.employeeService.putEmployee(employee).subscribe(e => this.employee = e);
    } else {
      this.employeeService.postEmployee(employee).subscribe(e => this.employee = e);
    }
  }

  deleteSkillFromEmployee(skill:String, employee:Employee) {
    employee.skillSet = employee.skillSet!.filter((s) => s !== skill);
  }

  cancel() {
    this.router.navigate(['/employee']).then();
  }

  addSkill() {
    if (this.employee!.skillSet!.filter((s) => s === this.selectedSkill).length < 1) {
      this.employee!.skillSet!.push(this.selectedSkill!);
    }
    this.selectedSkill = "";
  }

  createQualification() {
    if (this.newSkill) {
      this.qualificationService.postQualification({skill: this.newSkill!}).subscribe(q => this.qualifications.push(q));
      this.newSkill = "";
    }
  }
}
