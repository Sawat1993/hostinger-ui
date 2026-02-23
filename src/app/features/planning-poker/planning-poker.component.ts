import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';

@Component({
  selector: 'app-planning-poker',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ButtonModule],
  templateUrl: './planning-poker.component.html',
  styleUrls: ['./planning-poker.component.scss']
})
export class PlanningPokerComponent implements OnInit {
  isChildRouteActive = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateChildRouteStatus();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateChildRouteStatus();
      });
  }

  private updateChildRouteStatus(): void {
    this.isChildRouteActive = this.router.url.includes('/create-board') || this.router.url.includes('/join-board') || this.router.url.includes('/board');
  }

  navigateToCreateBoard(): void {
    this.router.navigate(['/planning-poker/create-board']);
  }

  navigateToJoinBoard(): void {
    this.router.navigate(['/planning-poker/join-board']);
  }
}
