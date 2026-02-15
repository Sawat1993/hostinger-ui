import { Component } from '@angular/core';

@Component({
  selector: 'app-ai',
  standalone: true,
  template: `
    <div class="flex flex-column align-items-center justify-content-center min-h-screen">
      <h2 class="mb-3 text-2xl text-primary-700 font-bold">AI Knowledge Assistant (RAG)</h2>
      <p class="mb-4 text-700 text-center" style="max-width: 500px;">
        Ask any question about my professional background, skills, or experience. This AI assistant leverages Retrieval-Augmented Generation (RAG) to provide intelligent, context-aware answers.
      </p>
      <!-- Add your AI chat UI or integration here -->
      <div class="surface-100 border-round p-4 text-600">AI chat coming soon...</div>
    </div>
  `
})
export class AiComponent {}
