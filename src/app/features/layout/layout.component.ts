import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<h1>App Layout</h1><router-outlet></router-outlet>`
})
export class LayoutComponent {}
