import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
  // marked.parse returns a string synchronously unless async option is set
  const html = marked.parse(value) as string;
  return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
