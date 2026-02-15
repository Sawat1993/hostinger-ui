
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

interface Project {
  title: string;
  description: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './about-me.html'
})
export class HomeComponent {
  projects: Project[] = [
    {
      title: 'AI Knowledge Assistant',
      description: 'An advanced AI assistant leveraging Retrieval-Augmented Generation to provide intelligent, context-aware answers about my professional expertise.',
      route: '/ai',
      icon: 'pi pi-comments'
    },
    {
      title: 'Agile Planning Poker',
      description: 'A collaborative tool for Agile teams, streamlining estimation and fostering consensus through interactive Planning Poker sessions.',
      route: '/planning-poker',
      icon: 'pi pi-users'
    }
  ];

  constructor(private router: Router) {}

  goToProject(route: string) {
    this.router.navigate([route]);
  }
}
