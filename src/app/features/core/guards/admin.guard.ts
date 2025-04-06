import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly router: Router,
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const session = await this.supabaseService.getSession();

    if (session && (session.user.user_metadata?.['role'] ?? 'admin') === 'admin') {
      return true;
    } else {
      this.router.navigate(['/auth/login']);

      return false;
    }
  }
}
