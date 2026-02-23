import { Component, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MarkdownPipe } from './markdown.pipe';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, MarkdownPipe],
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
})
export class AiComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }

  private removeLastLoadingMessage() {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].sender === 'ai' && this.messages[i].text === '...') {
        this.messages.splice(i, 1);
        break;
      }
    }
  }
  userMessage = '';
  messages: ChatMessage[] = [
    { sender: 'ai', text: 'Hi! I am your AI assistant. How can I help you today?' },
  ];

  constructor(private http: HttpService, private cdr: ChangeDetectorRef) {}

  sendMessage() {
    const message = this.userMessage.trim();
    if (!message) {
      return;
    }
    
    // Clear the message immediately
    this.userMessage = '';
    this.cdr.detectChanges();
    
    this.messages.push({ sender: 'user', text: message });
    this.cdr.detectChanges();
    // Show loading message
    this.messages.push({ sender: 'ai', text: '...' });
    this.cdr.detectChanges();
    this.http.get<any>('/ai/query', { q: message }, undefined, { hideLoader: true }).subscribe({
      next: (response) => {
        // Remove the last loading message from the end
        this.removeLastLoadingMessage();
        this.cdr.detectChanges();
        if (response?.answer) {
          this.messages.push({ sender: 'ai', text: response.answer });
          this.cdr.detectChanges();
        }
      },
      error: () => {
        // Remove the last loading message from the end on error
        this.removeLastLoadingMessage();
        this.cdr.detectChanges();
        // Optionally handle error
      },
    });
  }
}
