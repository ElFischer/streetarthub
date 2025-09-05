/**
 * Custom EditorJS Block for Cover Image Selection
 */

interface CoverBlockData {
  cover: {
    url: string;
    height?: number;
    width?: number;
  }[];
}

interface CoverBlockConfig {
  placeholder?: string;
  maxFiles?: number;
  postId?: string;
}

export default class CoverBlock {
  private api: any;
  private data: CoverBlockData;
  private config: CoverBlockConfig;
  private wrapper: HTMLElement | null = null;

  // Cover block is not shown in toolbox since it's always present by default
  static get toolbox() {
    return false;
  }

  static get enableLineBreaks() {
    return false;
  }

  static get isInline() {
    return false;
  }

  static get isReadOnlySupported() {
    return true;
  }

  constructor({ data, config, api }: { data?: CoverBlockData; config?: CoverBlockConfig; api: any }) {
    this.api = api;
    this.data = data || { cover: [] };
    this.config = config || {};
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('cover-block', 'ce-block__content');
    this.wrapper.innerHTML = this.getHTML();
    
    this.addEventListeners();
    
    return this.wrapper;
  }

  private getHTML(): string {
    const currentCover = this.data.cover?.[0];
    
    return `
      <div class="cover-block-container">
        <div class="cover-block-header">
          <h4 class="cover-block-title">Cover Image <span class="required-indicator">*</span></h4>
          <span class="cover-block-subtitle">Choose the main image for this artwork (required)</span>
        </div>
        <div class="cover-block-content">
          ${currentCover ? `
            <div class="cover-preview">
              <img src="${currentCover.url}" alt="Cover image" class="cover-image" />
              <div class="cover-overlay">
                <button class="cover-remove-btn" type="button">Remove</button>
                <button class="cover-change-btn" type="button">Change</button>
              </div>
            </div>
          ` : `
            <div class="cover-upload-area required">
              <div class="cover-upload-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                <p class="cover-upload-text">Click to upload cover image *</p>
                <p class="cover-upload-hint">JPG, PNG, GIF up to 10MB (required)</p>
              </div>
              <input type="file" class="cover-file-input" accept="image/*" style="display: none;" />
            </div>
          `}
        </div>
      </div>
      <style>
        .cover-block-container {
          margin: 8px 0;
        }
        .cover-block-header {
          margin-bottom: 12px;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
        .cover-block-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .cover-block-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .required-indicator {
          color: #dc2626;
          font-weight: bold;
        }
        .cover-block-content {
          min-height: 120px;
        }
        .cover-upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .cover-upload-area:hover {
          border-color: #3b82f6;
          background-color: #f8fafc;
        }
        .cover-upload-area.required {
          border-color: #dc2626;
          background-color: #fef2f2;
        }
        .cover-upload-area.required:hover {
          border-color: #b91c1c;
        }
        .cover-upload-placeholder svg {
          color: #9ca3af;
          margin-bottom: 12px;
        }
        .cover-upload-text {
          font-size: 16px;
          font-weight: 500;
          color: #374151;
          margin: 0 0 4px 0;
        }
        .cover-upload-hint {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        .cover-preview {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }
        .cover-image {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
          border-radius: 8px;
          overflow: hidden;
        }
        .cover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .cover-preview:hover .cover-overlay {
          opacity: 1;
        }
        .cover-remove-btn, .cover-change-btn {
          background: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .cover-remove-btn {
          color: #dc2626;
        }
        .cover-remove-btn:hover {
          background: #fef2f2;
        }
        .cover-change-btn {
          color: #3b82f6;
        }
        .cover-change-btn:hover {
          background: #eff6ff;
        }
        .cover-uploading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: #6b7280;
        }
      </style>
    `;
  }

  private addEventListeners(): void {
    if (!this.wrapper) return;

    const uploadArea = this.wrapper.querySelector('.cover-upload-area');
    const fileInput = this.wrapper.querySelector('.cover-file-input') as HTMLInputElement;
    const removeBtn = this.wrapper.querySelector('.cover-remove-btn');
    const changeBtn = this.wrapper.querySelector('.cover-change-btn');

    // Handle upload area click
    uploadArea?.addEventListener('click', () => {
      fileInput?.click();
    });

    // Handle file selection
    fileInput?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        this.uploadFile(file);
      }
    });

    // Handle remove button
    removeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeCover();
    });

    // Handle change button
    changeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput?.click();
    });

    // Handle drag and drop
    uploadArea?.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea?.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea?.addEventListener('drop', (e: Event) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      
      const dragEvent = e as DragEvent;
      const files = dragEvent.dataTransfer?.files;
      const file = files?.[0];
      if (file && file.type.startsWith('image/')) {
        this.uploadFile(file);
      }
    });
  }

  private async uploadFile(file: File): Promise<void> {
    try {
      // Show uploading state
      this.showUploadingState();

      // Check if this is a draft post (temporary storage)
      const postId = this.config.postId || 'temp';
      const isDraft = postId.startsWith('draft-');
      
      if (isDraft) {
        // For draft posts, store as Base64 temporarily
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Data = e.target?.result as string;
          
          // Create cover object with base64 data
          const coverData = {
            url: base64Data,
            width: 0,
            height: 0,
            file: file, // Store original file for later upload
            isDraft: true
          };

          // Update data
          this.data.cover = [coverData];
          
          // Re-render
          this.updateDisplay();
          
          console.log('Cover stored temporarily:', coverData);
        };
        reader.readAsDataURL(file);
      } else {
        // For existing posts, upload immediately to Firebase
        const { uploadFile } = await import('@/lib/firebaseStore');
        const date = new Date();
        
        // Upload to Firebase Storage
        const url = await uploadFile(file, `art/${postId}_${date.getTime()}`);
        
        // Create cover object
        const coverData = {
          url: url as string,
          width: 0,
          height: 0
        };

        // Update data
        this.data.cover = [coverData];
        
        // Re-render
        this.updateDisplay();
        
        console.log('Cover uploaded:', coverData);
      }
    } catch (error) {
      console.error('Error processing cover:', error);
      this.showError('Failed to process image. Please try again.');
    }
  }

  private removeCover(): void {
    this.data.cover = [];
    this.updateDisplay();
  }

  private showUploadingState(): void {
    if (this.wrapper) {
      const content = this.wrapper.querySelector('.cover-block-content');
      if (content) {
        content.innerHTML = `
          <div class="cover-uploading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;">
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Uploading image...
            <style>
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            </style>
          </div>
        `;
      }
    }
  }

  private showError(message: string): void {
    if (this.wrapper) {
      const content = this.wrapper.querySelector('.cover-block-content');
      if (content) {
        content.innerHTML = `
          <div style="padding: 24px; text-align: center; color: #dc2626; background: #fef2f2; border-radius: 8px;">
            ${message}
            <button onclick="location.reload()" style="display: block; margin: 12px auto 0; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">
              Try Again
            </button>
          </div>
        `;
      }
    }
  }

  private updateDisplay(): void {
    if (this.wrapper) {
      this.wrapper.innerHTML = this.getHTML();
      this.addEventListeners();
    }
  }

  save(): CoverBlockData {
    console.log('Saving cover data:', this.data.cover);
    return {
      cover: this.data.cover || []
    };
  }

  validate(data: CoverBlockData): boolean {
    // Cover image is required
    return Boolean(Array.isArray(data.cover) && data.cover.length > 0 && data.cover[0]?.url);
  }
}
