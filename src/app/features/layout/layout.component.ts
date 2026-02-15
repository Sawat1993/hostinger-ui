import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  get userName(): string | null {
    return this.commonService.getUserNameFromToken();
  }
  get isLoggedIn() {
    console.log('Checking login status:', this.commonService.isLoggedIn());
    return this.commonService.isLoggedIn();
  }

  constructor(private router: Router, public commonService: CommonService) {}


  login() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.commonService.logout();
    this.router.navigate(['/login']);
  }
}
