import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  name = '';
  otp = '';

  returnUrl: string | null = null;
  isRegisterMode = false;
  otpSent = false;
  otpTimer = 0;

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
    });
  }

  toggleRegisterMode() {
    this.isRegisterMode = !this.isRegisterMode;
    this.resetForm();
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.name = '';
    this.otp = '';
    this.otpSent = false;
    this.otpTimer = 0;
  }

  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  sendOtp() {
    if (!this.email) {
      console.error('Email is required');
      return;
    }

    this.http.post<any>('/users/register', { email: this.email }).subscribe({
      next: (res) => {
        console.log('OTP sent', res);
        this.otpSent = true;
        this.startOtpTimer();
      },
      error: (err) => {
        console.error('Failed to send OTP', err);
      },
    });
  }

  startOtpTimer() {
    this.otpTimer = 600; // 10 minutes
    const interval = setInterval(() => {
      this.otpTimer--;
      if (this.otpTimer <= 0) {
        clearInterval(interval);
        this.otpSent = false;
      }
    }, 1000);
  }

  onRegister() {
    if (!this.email || !this.password || !this.name || !this.otp) {
      console.error('All fields are required');
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
      name: this.name,
      otp: this.otp,
    };

    this.http.post<any>('/users', payload).subscribe({
      next: (res) => {
        console.log('Registration success', res);
        this.isRegisterMode = false;
        this.resetForm();
      },
      error: (err) => {
        console.error('Registration failed', err);
      },
    });
  }

  onLogin() {
    const payload = { email: this.email, password: this.password };
    this.http.post<any>('/users/login', payload).subscribe({
      next: (res) => {
        if (res && res.accessToken) {
          sessionStorage.setItem('accessToken', res.accessToken);
        }
        console.log('Login success', res);
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}

