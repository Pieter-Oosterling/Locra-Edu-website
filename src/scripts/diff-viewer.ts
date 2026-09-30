/* ==========================================================================
   Diff Viewer — Standalone diff component for showcasing
   ========================================================================== */

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: DiffLine[];
}

interface DiffLine {
  type: 'add' | 'remove' | 'context';
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

export class DiffViewer {
  private container: HTMLElement;
  private diffs: DiffHunk[];
  private currentHunk = 0;
  private showLineNumbers = true;
  private wrapLines = false;

  constructor(container: HTMLElement, diffs: DiffHunk[]) {
    this.container = container;
    this.diffs = diffs;
    this.render();
    this.bindEvents();
  }

  private render(): void {
    if (!this.diffs.length) {
      this.container.innerHTML = '<div class="diff-empty">Geen wijzigingen</div>';
      return;
    }

    const hunk = this.diffs[this.currentHunk];
    
    this.container.innerHTML = `
      <div class="diff-viewer">
        <div class="diff-header">
          <div class="diff-file-info">
            <span class="diff-file-label">Wijzigingen in</span>
            <span class="diff-filename">auth.guard.ts</span>
          </div>
          <div class="diff-nav">
            <button class="btn btn-ghost btn-sm" id="diff-prev-hunk" aria-label="Vorige hunk" ${this.currentHunk === 0 ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span class="diff-hunk-counter">${this.currentHunk + 1} / ${this.diffs.length}</span>
            <button class="btn btn-ghost btn-sm" id="diff-next-hunk" aria-label="Volgende hunk" ${this.currentHunk === this.diffs.length - 1 ? 'disabled' : ''}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="diff-table-container">
          <table class="diff-table" role="table" aria-label="Code diff">
            <colgroup>
              <col class="diff-gutter-col">
              <col class="diff-gutter-col">
              <col class="diff-content-col">
            </colgroup>
            <thead>
              <tr>
                <th scope="col" class="diff-gutter-head">Oud</th>
                <th scope="col" class="diff-gutter-head">Nieuw</th>
                <th scope="col" class="diff-content-head">Code</th>
              </tr>
            </thead>
            <tbody>
              ${hunk.lines.map((line, i) => this.renderDiffLine(line, i)).join('')}
            </tbody>
          </table>
        </div>

        <div class="diff-actions">
          <button class="btn btn-secondary btn-sm" id="diff-toggle-wrap" aria-label="${this.wrapLines ? 'Zet word wrap uit' : 'Zet word wrap aan'}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10H3M3 14h18M7 18l-5-5 5-5M17 18l5-5-5-5"/>
            </svg>
            ${this.wrapLines ? 'Wrap uit' : 'Wrap aan'}
          </button>
          <button class="btn btn-primary btn-sm" id="diff-apply" aria-label="Pas wijzigingen toe">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            Toepassen
          </button>
        </div>
      </div>
    `;
  }

  private renderDiffLine(line: DiffLine, index: number): string {
    const oldNum = line.oldLineNum !== undefined ? line.oldLineNum : '';
    const newNum = line.newLineNum !== undefined ? line.newLineNum : '';
    const marker = line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' ';
    const content = this.escapeHtml(line.content) || '&#8203;';
    const highlightedContent = this.highlightDiffLine(content, line.type);

    return `
      <tr class="diff-line ${line.type}" data-index="${index}">
        <td class="diff-gutter">${oldNum}</td>
        <td class="diff-gutter">${newNum}</td>
        <td class="diff-content">
          <span class="diff-marker" aria-hidden="true">${marker}</span>
          <span class="diff-code">${highlightedContent}</span>
        </td>
      </tr>
    `;
  }

  private highlightDiffLine(content: string, type: DiffLine['type']): string {
    // Basic syntax highlighting for diff lines
    return content
      .replace(/\b(import|export|const|let|var|function|return|if|else|for|while|class|interface|type|async|await|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|readonly|static|abstract|get|set)\b/g, '<span class="kw">$1</span>')
      .replace(/\b(string|number|boolean|void|any|unknown|never|null|undefined|object|Array|Promise|Map|Set)\b/g, '<span class="type">$1</span>')
      .replace(/\b(true|false)\b/g, '<span class="const">$1</span>')
      .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, '<span class="str">$1</span>')
      .replace(/(`[^`]*`)/g, '<span class="str">$1</span>')
      .replace(/(\/\/.*$)/, '<span class="comment">$1</span>')
      .replace(/(@\w+)/g, '<span class="dec">$1</span>');
  }

  private bindEvents(): void {
    this.container.querySelector('#diff-prev-hunk')?.addEventListener('click', () => this.navigateHunk(-1));
    this.container.querySelector('#diff-next-hunk')?.addEventListener('click', () => this.navigateHunk(1));
    this.container.querySelector('#diff-toggle-wrap')?.addEventListener('click', () => this.toggleWrap());
    this.container.querySelector('#diff-apply')?.addEventListener('click', () => this.applyDiff());
  }

  private navigateHunk(direction: number): void {
    const newIndex = this.currentHunk + direction;
    if (newIndex >= 0 && newIndex < this.diffs.length) {
      this.currentHunk = newIndex;
      this.render();
    }
  }

  private toggleWrap(): void {
    this.wrapLines = !this.wrapLines;
    this.container.querySelector('.diff-table')?.classList.toggle('wrap', this.wrapLines);
    this.render();
  }

  private applyDiff(): void {
    // Dispatch event for parent to handle
    this.container.dispatchEvent(new CustomEvent('diff-apply', {
      detail: { hunk: this.diffs[this.currentHunk] }
    }));
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public updateDiffs(diffs: DiffHunk[]): void {
    this.diffs = diffs;
    this.currentHunk = 0;
    this.render();
  }

  public destroy(): void {
    // Cleanup if needed
  }
}

// Static method to parse unified diff format
export function parseUnifiedDiff(diffText: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  const lines = diffText.split('\n');
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    
    // Match hunk header: @@ -oldStart,oldLines +newStart,newLines @@
    const hunkMatch = line.match(/^@@\s+-(\d+),?(\d*)\s+\+(\d+),?(\d*)\s+@@/);
    if (hunkMatch) {
      const oldStart = parseInt(hunkMatch[1], 10);
      const oldLines = hunkMatch[2] ? parseInt(hunkMatch[2], 10) : 1;
      const newStart = parseInt(hunkMatch[3], 10);
      const newLines = hunkMatch[4] ? parseInt(hunkMatch[4], 10) : 1;
      
      const hunk: DiffHunk = {
        oldStart,
        oldLines,
        newStart,
        newLines,
        lines: []
      };
      
      let oldLineNum = oldStart;
      let newLineNum = newStart;
      i++;
      
      while (i < lines.length && !lines[i].startsWith('@@')) {
        const diffLine = lines[i];
        if (diffLine.startsWith('+')) {
          hunk.lines.push({
            type: 'add',
            content: diffLine.slice(1),
            newLineNum: newLineNum++
          });
        } else if (diffLine.startsWith('-')) {
          hunk.lines.push({
            type: 'remove',
            content: diffLine.slice(1),
            oldLineNum: oldLineNum++
          });
        } else if (diffLine.startsWith(' ')) {
          hunk.lines.push({
            type: 'context',
            content: diffLine.slice(1),
            oldLineNum: oldLineNum++,
            newLineNum: newLineNum++
          });
        } else if (diffLine.startsWith('\\')) {
          // No newline at end of file marker
        } else {
          // Context line without leading space (shouldn't happen in valid diff)
          hunk.lines.push({
            type: 'context',
            content: diffLine,
            oldLineNum: oldLineNum++,
            newLineNum: newLineNum++
          });
        }
        i++;
      }
      
      hunks.push(hunk);
    } else {
      i++;
    }
  }
  
  return hunks;
}