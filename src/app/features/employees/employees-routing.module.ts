import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from '../../shared/layouts/default-layout/default-layout.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { EmployeeFormPageComponent } from './pages/employee-form-page/employee-form-page.component';
import { EmployeeListPageComponent } from './pages/employee-list-page/employee-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: EmployeeListPageComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'new',
        component: EmployeeFormPageComponent,
        canActivate: [AdminGuard],
      },
      {
        path: ':id',
        component: EmployeeFormPageComponent,
        canActivate: [AdminGuard],
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {
}
