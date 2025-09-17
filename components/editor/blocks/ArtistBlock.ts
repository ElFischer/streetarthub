/**
 * Custom EditorJS Block for Artist Selection
 */

interface ArtistBlockData {
  artists: string[];
}

interface ArtistBlockConfig {
  placeholder?: string;
  availableArtists?: { id: string; name: string }[];
}

export default class ArtistBlock {
  private api: any;
  private data: ArtistBlockData;
  private config: ArtistBlockConfig;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Artists',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 1C5.03 1 1 5.03 1 10s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-2-10c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm4 0c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm-2 6c1.66 0 3-1.34 3-3H7c0 1.66 1.34 3 3 3z"/></svg>'
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

  constructor({ data, config, api }: { data?: ArtistBlockData; config?: ArtistBlockConfig; api: any }) {
    this.api = api;
    this.data = data || { artists: [] };
    this.config = config || {};
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('artist-block', 'ce-block__content');
    this.wrapper.innerHTML = this.getHTML();
    
    this.mountReactComponent();
    
    // Aggressively prevent paragraph creation
    this.preventParagraphCreation();
    
    return this.wrapper;
  }

  private preventParagraphCreation() {
    // Try multiple strategies to prevent paragraph creation
    setTimeout(() => {
      if (this.api?.blocks) {
        try {
          const blocksCount = this.api.blocks.getBlocksCount();
          
          // Check last few blocks for empty paragraphs and remove them
          for (let i = blocksCount - 1; i >= Math.max(0, blocksCount - 3); i--) {
            const block = this.api.blocks.getBlockByIndex(i);
            if (block && block.name === 'paragraph') {
              const blockData = block.save();
              if (blockData && (!blockData.text || blockData.text.trim() === '')) {
                this.api.blocks.delete(i);
              }
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }, 10);
    
    // Also try after a longer delay
    setTimeout(() => {
      if (this.api?.blocks) {
        try {
          const blocksCount = this.api.blocks.getBlocksCount();
          
          for (let i = blocksCount - 1; i >= Math.max(0, blocksCount - 2); i--) {
            const block = this.api.blocks.getBlockByIndex(i);
            if (block && block.name === 'paragraph') {
              const blockData = block.save();
              if (blockData && (!blockData.text || blockData.text.trim() === '')) {
                this.api.blocks.delete(i);
              }
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }, 200);
  }

  private getHTML(): string {
    return `
      <div class="artist-block-container">
        <div class="artist-block-header">
          <h4 class="artist-block-title">Artists</h4>
          <span class="artist-block-subtitle">Who created this artwork?</span>
        </div>
        <div id="artist-combobox-mount" class="artist-block-content">
          <!-- React ArtistCombobox will be mounted here -->
        </div>
      </div>
      <style>
        .artist-block-container {
          margin: 8px 0;
        }
        .artist-block-header {
          margin-bottom: 12px;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
        .artist-block-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .artist-block-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .artist-block-content {
          min-height: 60px;
        }
      </style>
    `;
  }

  private async mountReactComponent(): Promise<void> {
    try {
      // Dynamically import React and the ArtistCombobox
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      const ArtistComboboxModule = await import('@/components/ui/artist-combobox');
      const ArtistCombobox = ArtistComboboxModule.ArtistCombobox;

      const mountPoint = this.wrapper?.querySelector('#artist-combobox-mount');
      if (!mountPoint) return;

      // Create a wrapper component with proper state management
      const ArtistBlockWrapper = () => {
        const [artists, setArtists] = React.useState<string[]>(this.data.artists || []);

        const handleChange = (newArtists: string[]) => {
          console.log('Artists changed:', newArtists);
          setArtists(newArtists);
          this.data.artists = newArtists;
          
          // Trigger change event for EditorJS
          if (this.api?.blocks) {
            this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex())?.holder?.dispatchEvent(
              new CustomEvent('artistsChanged', { detail: newArtists })
            );
          }
        };

        React.useEffect(() => {
          setArtists(this.data.artists || []);
          
          // Auto-focus the combobox input when the block is mounted
          setTimeout(() => {
            const comboboxInput = mountPoint.querySelector('input[type="text"]') as HTMLInputElement;
            if (comboboxInput) {
              comboboxInput.focus();
              comboboxInput.click(); // Also trigger click to open the dropdown
            }
          }, 100);
        }, []);

        return React.createElement(ArtistCombobox, {
          value: artists,
          onChange: handleChange,
          placeholder: this.config.placeholder || 'Select or add artists...'
        });
      };

      // Mount the React component
      const root = ReactDOM.createRoot(mountPoint);
      root.render(React.createElement(ArtistBlockWrapper));
      
      // Store root reference for cleanup
      (this as any).reactRoot = root;
    } catch (error) {
      console.error('Failed to mount React component in ArtistBlock:', error);
      // Fallback to basic HTML input
      this.fallbackToBasicInput();
    }
  }

  private fallbackToBasicInput(): void {
    const mountPoint = this.wrapper?.querySelector('#artist-combobox-mount');
    if (!mountPoint) return;

    const selectedArtists = this.data.artists || [];
    const artistTags = selectedArtists.map(artist => 
      `<span class="artist-tag" style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 16px; font-size: 14px; margin: 2px;">${artist}</span>`
    ).join(' ');

    mountPoint.innerHTML = `
      <div style="margin-bottom: 8px;">${artistTags}</div>
      <input 
        type="text" 
        placeholder="${this.config.placeholder || 'Add artist...'}"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
        onkeypress="if(event.key==='Enter') { this.parentElement.dispatchEvent(new CustomEvent('addArtist', {detail: this.value})); this.value=''; }"
      />
    `;

    mountPoint.addEventListener('addArtist', (e: any) => {
      const artistName = e.detail.trim();
      if (artistName && !this.data.artists.includes(artistName)) {
        this.data.artists.push(artistName);
        this.fallbackToBasicInput(); // Re-render
      }
    });
  }


  save(): ArtistBlockData {
    console.log('Saving artist data:', this.data.artists);
    return {
      artists: this.data.artists || []
    };
  }

  validate(data: ArtistBlockData): boolean {
    return Array.isArray(data.artists);
  }

  destroy(): void {
    // Cleanup React component
    if ((this as any).reactRoot) {
      try {
        // Use setTimeout to avoid race condition during React rendering
        setTimeout(() => {
          if ((this as any).reactRoot) {
            (this as any).reactRoot.unmount();
            (this as any).reactRoot = null;
          }
        }, 0);
      } catch (error) {
        console.debug('Error unmounting ArtistBlock React component:', error);
        (this as any).reactRoot = null;
      }
    }
  }
}
