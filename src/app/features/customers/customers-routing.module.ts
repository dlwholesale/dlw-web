import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/layouts/default-layout/default-layout.component';

import { AuthGuard } from '../core/guards/auth.guard';
import { CustomerFormPageComponent } from './pages/customer-form-page/customer-form-page.component';
import { CustomerListPageComponent } from './pages/customer-list-page/customer-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: CustomerListPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'new',
        component: CustomerFormPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':id',
        component: CustomerFormPageComponent,
        canActivate: [AuthGuard],
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
export class CustomersRoutingModule {
}
