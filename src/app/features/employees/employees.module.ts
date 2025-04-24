import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from "@angular/material/tooltip";

import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeFormPageComponent } from './pages/employee-form-page/employee-form-page.component';
import { EmployeeListPageComponent } from './pages/employee-list-page/employee-list-page.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeListPageComponent,
    EmployeeFormComponent,
    EmployeeFormPageComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmployeesRoutingModule,
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule,
    MatIconButton,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltip,
    MatMenuTrigger,
    MatMenuModule,
  ],
})
export class EmployeesModule {
}
