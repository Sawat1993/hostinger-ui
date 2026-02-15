import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: true,
  template: `<h1>App Layout</h1><router-outlet></router-outlet>`
})
export class LayoutComponent {}
