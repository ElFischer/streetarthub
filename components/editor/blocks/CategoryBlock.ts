/**
 * Custom EditorJS Block for Category Selection
 */

interface CategoryBlockData {
  categories: string[];
}

interface CategoryBlockConfig {
  placeholder?: string;
  predefinedCategories?: string[];
}

export default class CategoryBlock {
  private api: any;
  private data: CategoryBlockData;
  private config: CategoryBlockConfig;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Categories',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm-6 6h4v4H4v-4zm6 0h4v4h-4v-4zm6-6h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/></svg>'
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

  constructor({ data, config, api }: { data?: CategoryBlockData; config?: CategoryBlockConfig; api: any }) {
    this.api = api;
    this.data = data || { categories: [] };
    this.config = config || {};
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('category-block', 'ce-block__content');
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
      <div class="category-block-container">
        <div class="category-block-header">
          <h4 class="category-block-title">Styles</h4>
          <span class="category-block-subtitle">What type of street art is this?</span>
        </div>
        <div id="category-combobox-mount" class="category-block-content">
          <!-- React CategoryCombobox will be mounted here -->
        </div>
      </div>
      <style>
        .category-block-container {
          margin: 8px 0;
        }
        .category-block-header {
          margin-bottom: 12px;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
        .category-block-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .category-block-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .category-block-content {
          min-height: 60px;
        }
      </style>
    `;
  }

  private async mountReactComponent(): Promise<void> {
    try {
      // Dynamically import React and the CategoryCombobox
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      const CategoryComboboxModule = await import('@/components/ui/category-combobox');
      const CategoryCombobox = CategoryComboboxModule.CategoryCombobox;

      const mountPoint = this.wrapper?.querySelector('#category-combobox-mount');
      if (!mountPoint) return;

      // Create a wrapper component with proper state management
      const CategoryBlockWrapper = () => {
        const [categories, setCategories] = React.useState<string[]>(this.data.categories || []);

        const handleChange = (newCategories: string[]) => {
          console.log('Categories changed:', newCategories);
          setCategories(newCategories);
          this.data.categories = newCategories;
          
          // Trigger change event for EditorJS
          if (this.api?.blocks) {
            this.api.blocks.getBlockByIndex(this.api.blocks.getCurrentBlockIndex())?.holder?.dispatchEvent(
              new CustomEvent('categoriesChanged', { detail: newCategories })
            );
          }
        };

        React.useEffect(() => {
          setCategories(this.data.categories || []);
          
          // Auto-focus the combobox input when the block is mounted
          setTimeout(() => {
            const comboboxInput = mountPoint.querySelector('input[type="text"]') as HTMLInputElement;
            if (comboboxInput) {
              comboboxInput.focus();
              comboboxInput.click(); // Also trigger click to open the dropdown
            }
          }, 100);
        }, []);

        return React.createElement(CategoryCombobox, {
          value: categories,
          onChange: handleChange,
          placeholder: this.config.placeholder || 'Select or add categories...'
        });
      };

      // Mount the React component
      const root = ReactDOM.createRoot(mountPoint);
      root.render(React.createElement(CategoryBlockWrapper));
      
      // Store root reference for cleanup
      (this as any).reactRoot = root;
    } catch (error) {
      console.error('Failed to mount React component in CategoryBlock:', error);
      // Fallback to basic HTML input
      this.fallbackToBasicInput();
    }
  }

  private fallbackToBasicInput(): void {
    const mountPoint = this.wrapper?.querySelector('#category-combobox-mount');
    if (!mountPoint) return;

    const selectedCategories = this.data.categories || [];
    const categoryTags = selectedCategories.map(category => 
      `<span class="category-tag" style="background: #eab308; color: white; padding: 4px 8px; border-radius: 16px; font-size: 14px; margin: 2px;">${category}</span>`
    ).join(' ');

    mountPoint.innerHTML = `
      <div style="margin-bottom: 8px;">${categoryTags}</div>
      <input 
        type="text" 
        placeholder="${this.config.placeholder || 'Add category...'}"
        style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;"
        onkeypress="if(event.key==='Enter') { this.parentElement.dispatchEvent(new CustomEvent('addCategory', {detail: this.value})); this.value=''; }"
      />
    `;

    mountPoint.addEventListener('addCategory', (e: any) => {
      const categoryName = e.detail.trim().toLowerCase();
      if (categoryName && !this.data.categories.includes(categoryName)) {
        this.data.categories.push(categoryName);
        this.fallbackToBasicInput(); // Re-render
      }
    });
  }


  save(): CategoryBlockData {
    console.log('Saving category data:', this.data.categories);
    return {
      categories: this.data.categories || []
    };
  }

  validate(data: CategoryBlockData): boolean {
    return Array.isArray(data.categories);
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
        console.debug('Error unmounting CategoryBlock React component:', error);
        (this as any).reactRoot = null;
      }
    }
  }
}
