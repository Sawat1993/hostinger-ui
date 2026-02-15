import { Component } from '@angular/core';

@Component({
  selector: 'app-planning-poker',
  standalone: true,
  template: `
    <div class="flex flex-column align-items-center justify-content-center min-h-screen">
      <h2 class="mb-3 text-2xl text-primary-700 font-bold">Agile Planning Poker</h2>
      <p class="mb-4 text-700 text-center" style="max-width: 500px;">
        A collaborative tool for Agile teams, streamlining estimation and fostering consensus through interactive Planning Poker sessions.
      </p>
      <div class="surface-100 border-round p-4 text-600">Planning Poker coming soon...</div>
    </div>
  `
})
export class PlanningPokerComponent {}
