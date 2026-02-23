import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { HttpService } from '../../../../services/http.service';

interface Story {
  storyId?: string;
  title: string;
  estimate?: number;
}

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    RippleModule,
    TagModule,
    TooltipModule,
    DialogModule,
    FormsModule,
    TextareaModule,
  ],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  @Input() boardId: string | null = null;
  @Output() storyCreated = new EventEmitter<string>();

  showAddStoryDialog: boolean = false;
  newStoryTitle: string = '';
  currentStory: Story | null = null;
  pastStories: Story[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    if (this.boardId) {
      this.loadStories();
    }
  }

  loadStories(): void {
    if (!this.boardId) {
      console.error('Board ID is missing');
      return;
    }

    this.httpService.get<Story[]>(`/planning-poker/board/${this.boardId}/stories`).subscribe({
      next: (stories: Story[]) => {
        if (stories && stories.length > 0) {
          this.currentStory = stories[0];
          this.pastStories = stories.slice(1);
          this.selectStory(this.currentStory);
        }
      },
      error: (error) => {
        console.error('Failed to load stories:', error);
      },
    });
  }

  selectStory(story: Story): void {
    const storyId = story.storyId || '';
    this.storyCreated.emit(storyId);
  }

  onAddStory(): void {
    this.showAddStoryDialog = true;
    this.newStoryTitle = '';
  }

  onAddStoryConfirm(): void {
    if (!this.boardId || !this.newStoryTitle.trim()) {
      console.error('Board ID or story title is missing');
      return;
    }

    this.httpService.post(`/planning-poker/board/${this.boardId}/story`, {
      title: this.newStoryTitle.trim(),
    }).subscribe({
      next: (response: any) => {
        this.showAddStoryDialog = false;
        this.newStoryTitle = '';
        this.loadStories();
      },
      error: (error) => {
        console.error('Failed to add story:', error);
      },
    });
  }

  onAddStoryCancel(): void {
    this.showAddStoryDialog = false;
    this.newStoryTitle = '';
  }
}
