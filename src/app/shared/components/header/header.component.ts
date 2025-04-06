import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SupabaseService } from '../../../features/core/services/supabase.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isAdmin: boolean = false;
  userName: string | null = null;

  constructor(private readonly supabaseService: SupabaseService, private readonly router: Router) {
    this.checkUserRole();
  }

  logout() {
    this.supabaseService.logout();

    this.router.navigate(['/auth/login']);
  }

  toggleSidenav() {
    console.log('Toggle Side Navigation (for mobile view)');
  }

  private checkUserRole() {
    this.supabaseService.getSession().then(session => {
      if (session) {
        this.isAdmin = (session?.user?.user_metadata?.['role'] ?? 'admin') === 'admin';
        this.userName = session?.user?.user_metadata?.['name'];
      }
    });
  }
}
