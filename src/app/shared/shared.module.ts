import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenavContainer, MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout/simple-layout.component';


@NgModule({
  declarations: [
    DefaultLayoutComponent,
    SimpleLayoutComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatSidenavContainer,
    MatNavList,
    MatListItem,
  ],
})
export class SharedModule {
}
