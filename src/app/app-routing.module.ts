import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ EmployeeListComponent } from "./employee-list/employee-list.component";
import {AuthGuard} from "./utitlity/app.guard";
import {QualificationListComponent} from "./qualification-list/qualification-list.component";
import {EmployeeDetailComponent} from "./employee-detail/employee-detail.component";

const routes: Routes = [
  { path: '', redirectTo: '/employee', pathMatch: 'full' },
  { path: 'employee', component: EmployeeListComponent, canActivate: [AuthGuard]},
  { path: 'qualifications', component: QualificationListComponent, canActivate: [AuthGuard]},
  { path: 'employee/:id', component: EmployeeDetailComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
