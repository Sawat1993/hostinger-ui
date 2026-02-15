import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '../../guards/auth.guard';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];
