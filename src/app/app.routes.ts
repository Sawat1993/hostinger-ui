import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './features/layout/layout.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        title: 'Home',
        loadChildren: () => import('./features/home/home.routes').then(m => m.homeRoutes)
      },
      {
        path: 'planning-poker',
        canActivate: [authGuard],
        title: 'Planning Poker',
        loadChildren: () => import('./features/planning-poker/planning-poker.routes').then(m => m.planningPokerRoutes)
      },
      {
        path: 'ai',
        title: 'AI',  
        loadChildren: () => import('./features/ai/ai.routes').then(m => m.aiRoutes)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
