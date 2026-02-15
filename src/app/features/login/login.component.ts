import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private http: HttpService,
    private commonService: CommonService,
    private router: Router,
  ) {}

  onLogin() {
    const payload = { email: this.email, password: this.password };
    this.http.post<any>('/users/login', payload).subscribe({
      next: (res) => {
        if (res && res.accessToken) {
          sessionStorage.setItem('accessToken', res.accessToken);
        }
        // handle success (e.g., store token, redirect, etc.)
        console.log('Login success', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        // handle error (e.g., show error message)
        console.error('Login failed', err);
      },
    });
  }
}
