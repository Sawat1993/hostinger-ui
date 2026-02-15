import { Routes } from '@angular/router';
import { PlanningPokerComponent } from './planning-poker.component';
import { authGuard } from '../../guards/auth.guard';

export const planningPokerRoutes: Routes = [
  {
    path: '',
    component: PlanningPokerComponent,
  }
];
