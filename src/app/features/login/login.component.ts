import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';

  returnUrl: string | null = null;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
    });
  }

  onLogin() {
    const payload = { email: this.email, password: this.password };
    this.http.post<any>('/users/login', payload).subscribe({
      next: (res) => {
        if (res && res.accessToken) {
          sessionStorage.setItem('accessToken', res.accessToken);
        }
        // handle success (e.g., store token, redirect, etc.)
        console.log('Login success', res);
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        // handle error (e.g., show error message)
        console.error('Login failed', err);
      },
    });
  }
}
