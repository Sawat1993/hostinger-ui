import { Routes } from '@angular/router';
import { PlanningPokerComponent } from './planning-poker.component';
import { CreateBoardComponent } from './create-board/create-board.component';
import { JoinBoardComponent } from './join-board/join-board.component';
import { BoardComponent } from './board/board.component';

export const planningPokerRoutes: Routes = [
  {
    path: '',
    component: PlanningPokerComponent,
    children: [
      {
        path: 'create-board',
        component: CreateBoardComponent
      },
      {
        path: 'join-board',
        component: JoinBoardComponent
      },
      {
        path: 'board/:boardId',
        component: BoardComponent
      }
    ]
  }
];
