import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly supabaseService: SupabaseService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.supabaseService.getSession().then(session => {
      if (session) {
        this.router.navigate([this.roleDefaultPage(session.user.user_metadata?.['role'] ?? 'admin')]);
      }
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;
    const { error, data } = await this.supabaseService.login(email, password);

    if (error) {
      this.toastr.error(error.message, 'Error');
    } else {
      this.toastr.success('Logged in successfully!', 'Success');

      this.router.navigate([this.roleDefaultPage(data.session.user.user_metadata?.['role'] ?? 'admin')]);
    }
  }

  private roleDefaultPage(role: string): string {
    return (role === 'admin') ? '/employees' : '/customers';
  }
}
