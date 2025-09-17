/**
 * Custom EditorJS Block for Metadata (Description & Source)
 */

interface MetadataBlockData {
  description: string;
  source: string;
}

interface MetadataBlockConfig {
  descriptionPlaceholder?: string;
  sourcePlaceholder?: string;
}

export default class MetadataBlock {
  private api: any;
  private data: MetadataBlockData;
  private config: MetadataBlockConfig;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Metadata',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 3h14a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v10h12V5H4zm2 2h8v1H6V7zm0 2h8v1H6V9zm0 2h6v1H6v-1z"/></svg>'
    };
  }

  static get enableLineBreaks() {
    return false;
  }

  static get isInline() {
    return false;
  }

  static get pasteConfig() {
    return {
      tags: [],
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api }: { data?: MetadataBlockData; config?: MetadataBlockConfig; api: any }) {
    this.api = api;
    this.data = data || { description: '', source: '' };
    this.config = config || {};
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('metadata-block', 'ce-block__content');
    this.wrapper.innerHTML = this.getHTML();
    
    this.addEventListeners();
    
    return this.wrapper;
  }

  private getHTML(): string {
    return `
      <div class="metadata-block-container">
        <div class="metadata-block-header">
          <h4 class="metadata-block-title">Description & Source</h4>
          <span class="metadata-block-subtitle">Add details about this artwork</span>
        </div>
        <div class="metadata-block-content">
          <div class="metadata-field">
            <label class="metadata-label" for="description-input">Description</label>
            <textarea 
              id="description-input"
              class="metadata-textarea" 
              placeholder="${this.config.descriptionPlaceholder || 'Describe the artwork, location, or context...'}"
              rows="4"
            >${this.data.description || ''}</textarea>
          </div>
          <div class="metadata-field">
            <label class="metadata-label" for="source-input">Source URL</label>
            <input 
              id="source-input"
              type="url" 
              class="metadata-input" 
              placeholder="${this.config.sourcePlaceholder || 'https://example.com/artwork-source'}"
              value="${this.data.source || ''}"
            />
          </div>
        </div>
      </div>
      <style>
        .metadata-block-container {
          margin: 8px 0;
        }
        .metadata-block-header {
          margin-bottom: 12px;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
        .metadata-block-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .metadata-block-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .metadata-block-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .metadata-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .metadata-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .metadata-textarea, .metadata-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
        }
        .metadata-textarea:focus, .metadata-input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .metadata-textarea {
          min-height: 80px;
        }
      </style>
    `;
  }

  private addEventListeners(): void {
    if (!this.wrapper) return;

    const descriptionTextarea = this.wrapper.querySelector('#description-input') as HTMLTextAreaElement;
    const sourceInput = this.wrapper.querySelector('#source-input') as HTMLInputElement;

    // Handle description changes
    descriptionTextarea?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement;
      this.data.description = target.value;
    });

    // Handle source changes
    sourceInput?.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.data.source = target.value;
    });

    // Auto-resize textarea
    descriptionTextarea?.addEventListener('input', () => {
      descriptionTextarea.style.height = 'auto';
      descriptionTextarea.style.height = descriptionTextarea.scrollHeight + 'px';
    });
  }

  save(): MetadataBlockData {
    const descriptionTextarea = this.wrapper?.querySelector('#description-input') as HTMLTextAreaElement;
    const sourceInput = this.wrapper?.querySelector('#source-input') as HTMLInputElement;

    return {
      description: descriptionTextarea?.value || '',
      source: sourceInput?.value || ''
    };
  }

  validate(data: MetadataBlockData): boolean {
    return typeof data.description === 'string' && typeof data.source === 'string';
  }
}
