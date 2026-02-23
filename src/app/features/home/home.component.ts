
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonService } from '../../services/common.service';

interface Project {
  title: string;
  description: string;
  route: string;
  icon?: string;
  requiresLogin?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './about-me.html'
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  
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
      icon: 'pi pi-users',
      requiresLogin: true
    }
  ];

  constructor(private router: Router, private commonService: CommonService) {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.commonService.isLoggedIn();
  }

  goToProject(route: string): void {
    this.router.navigate([route]);
  }
}
