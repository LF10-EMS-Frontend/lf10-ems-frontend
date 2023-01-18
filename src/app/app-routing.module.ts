import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{ EmployeeListComponent } from "./employee-list/employee-list.component";
import {AuthGuard} from "./utitlity/app.guard";

const routes: Routes = [
  { path: '', redirectTo: '/employee', pathMatch: 'full' },
  { path: 'employee', component: EmployeeListComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
