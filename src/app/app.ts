
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LoaderComponent } from './shared/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [ConfirmationService]
})
export class App {
  protected readonly title = signal('ui');
}
