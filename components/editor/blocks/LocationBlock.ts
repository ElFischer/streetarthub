/**
 * Custom EditorJS Block for Location Data
 */

interface LocationBlockData {
  country: {
    long_name: string;
    short_name: string;
  };
  locality: {
    long_name: string;
    short_name: string;
  };
  geoData: {
    lat: number;
    lng: number;
  };
}

interface LocationBlockConfig {
  enableGeolocation?: boolean;
}

export default class LocationBlock {
  private api: any;
  private data: LocationBlockData;
  private config: LocationBlockConfig;
  private wrapper: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Location',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2C7.79 2 6 3.79 6 6c0 3.5 4 9 4 9s4-5.5 4-9c0-2.21-1.79-4-4-4zm0 5.5c-.83 0-1.5-.67-1.5-1.5S9.17 4.5 10 4.5s1.5.67 1.5 1.5S10.83 7.5 10 7.5z"/></svg>'
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

  constructor({ data, config, api }: { data?: LocationBlockData; config?: LocationBlockConfig; api: any }) {
    this.api = api;
    this.data = data || {
      country: { long_name: '', short_name: '' },
      locality: { long_name: '', short_name: '' },
      geoData: { lat: 0, lng: 0 }
    };
    this.config = config || {};
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('location-block', 'ce-block__content');
    this.wrapper.innerHTML = this.getHTML();
    
    this.addEventListeners();
    
    return this.wrapper;
  }

  private getHTML(): string {
    return `
      <div class="location-block-container">
        <div class="location-block-header">
          <h4 class="location-block-title">Location</h4>
          <span class="location-block-subtitle">Where was this artwork found?</span>
        </div>
        ${this.config.enableGeolocation ? `
            <button class="geolocation-btn" type="button">
              📍 Use Current Location
            </button>
          ` : ''}
        <div class="location-block-content">
          <div class="location-row">
            <div class="location-field">
              <label class="location-label" for="country-input">Country</label>
              <input 
                id="country-input"
                type="text" 
                class="location-input" 
                placeholder="Germany, New Zealand, USA..."
                value="${this.data.country?.long_name || ''}"
              />
            </div>
            <div class="location-field">
              <label class="location-label" for="country-code-input">Country Code</label>
              <input 
                id="country-code-input"
                type="text" 
                class="location-input" 
                placeholder="DE, NZ, US..."
                value="${this.data.country?.short_name || ''}"
                maxlength="3"
              />
            </div>
          </div>
          <div class="location-row">
            <div class="location-field">
              <label class="location-label" for="city-input">City</label>
              <input 
                id="city-input"
                type="text" 
                class="location-input" 
                placeholder="Berlin, Auckland, New York..."
                value="${this.data.locality?.long_name || ''}"
              />
            </div>
            <div class="location-field">
              <label class="location-label" for="city-short-input">City Short</label>
              <input 
                id="city-short-input"
                type="text" 
                class="location-input" 
                placeholder="Short city name..."
                value="${this.data.locality?.short_name || ''}"
              />
            </div>
          </div>
          <div class="location-row">
            <div class="location-field">
              <label class="location-label" for="latitude-input">Latitude</label>
              <input 
                id="latitude-input"
                type="number" 
                class="location-input" 
                placeholder="-45.8787605"
                step="any"
                value="${this.data.geoData?.lat || ''}"
              />
            </div>
            <div class="location-field">
              <label class="location-label" for="longitude-input">Longitude</label>
              <input 
                id="longitude-input"
                type="number" 
                class="location-input" 
                placeholder="170.5027976"
                step="any"
                value="${this.data.geoData?.lng || ''}"
              />
            </div>
          </div>
        </div>
      </div>
      <style>
        .location-block-container {
          margin: 8px 0;
        }
        .location-block-header {
          margin-bottom: 12px;
          display: flex;
          flex-direction: row;
          gap: 8px;
        }
        .location-block-title {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }
        .location-block-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        .geolocation-btn {
          align-self: flex-start;
          background: #f59e0b;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .geolocation-btn:hover {
          background: #d97706;
        }
        .location-block-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .location-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .location-row {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
        .location-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .location-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }
        .location-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }
        .location-input:focus {
          outline: none;
          border-color: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
      </style>
    `;
  }

  private addEventListeners(): void {
    if (!this.wrapper) return;

    // Get all input elements
    const inputs = {
      country: this.wrapper.querySelector('#country-input') as HTMLInputElement,
      countryCode: this.wrapper.querySelector('#country-code-input') as HTMLInputElement,
      city: this.wrapper.querySelector('#city-input') as HTMLInputElement,
      cityShort: this.wrapper.querySelector('#city-short-input') as HTMLInputElement,
      latitude: this.wrapper.querySelector('#latitude-input') as HTMLInputElement,
      longitude: this.wrapper.querySelector('#longitude-input') as HTMLInputElement,
    };

    // Add event listeners for data updates
    inputs.country?.addEventListener('input', (e) => {
      this.data.country.long_name = (e.target as HTMLInputElement).value;
    });

    inputs.countryCode?.addEventListener('input', (e) => {
      this.data.country.short_name = (e.target as HTMLInputElement).value.toUpperCase();
      (e.target as HTMLInputElement).value = this.data.country.short_name; // Show uppercase
    });

    inputs.city?.addEventListener('input', (e) => {
      this.data.locality.long_name = (e.target as HTMLInputElement).value;
    });

    inputs.cityShort?.addEventListener('input', (e) => {
      this.data.locality.short_name = (e.target as HTMLInputElement).value;
    });

    inputs.latitude?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.data.geoData.lat = isNaN(value) ? 0 : value;
    });

    inputs.longitude?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.data.geoData.lng = isNaN(value) ? 0 : value;
    });

    // Geolocation button
    const geoBtn = this.wrapper.querySelector('.geolocation-btn') as HTMLButtonElement;
    geoBtn?.addEventListener('click', () => {
      this.getCurrentLocation();
    });
  }

  private getCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    const geoBtn = this.wrapper?.querySelector('.geolocation-btn') as HTMLButtonElement;
    if (geoBtn) {
      geoBtn.textContent = '📍 Getting location...';
      geoBtn.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.data.geoData.lat = position.coords.latitude;
        this.data.geoData.lng = position.coords.longitude;
        
        // Update the input fields
        const latInput = this.wrapper?.querySelector('#latitude-input') as HTMLInputElement;
        const lngInput = this.wrapper?.querySelector('#longitude-input') as HTMLInputElement;
        
        if (latInput) latInput.value = this.data.geoData.lat.toString();
        if (lngInput) lngInput.value = this.data.geoData.lng.toString();
        
        // Try to reverse geocode for city/country info
        this.reverseGeocode(this.data.geoData.lat, this.data.geoData.lng);
        
        if (geoBtn) {
          geoBtn.textContent = '📍 Use Current Location';
          geoBtn.disabled = false;
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enter coordinates manually.');
        
        if (geoBtn) {
          geoBtn.textContent = '📍 Use Current Location';
          geoBtn.disabled = false;
        }
      }
    );
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      // This is a basic implementation. In production, you'd want to use a proper geocoding service
      // For now, we'll just focus on getting the coordinates
      console.log(`Coordinates set: ${lat}, ${lng}`);
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  }

  save(): LocationBlockData {
    const inputs = {
      country: this.wrapper?.querySelector('#country-input') as HTMLInputElement,
      countryCode: this.wrapper?.querySelector('#country-code-input') as HTMLInputElement,
      city: this.wrapper?.querySelector('#city-input') as HTMLInputElement,
      cityShort: this.wrapper?.querySelector('#city-short-input') as HTMLInputElement,
      latitude: this.wrapper?.querySelector('#latitude-input') as HTMLInputElement,
      longitude: this.wrapper?.querySelector('#longitude-input') as HTMLInputElement,
    };

    return {
      country: {
        long_name: inputs.country?.value || '',
        short_name: inputs.countryCode?.value || ''
      },
      locality: {
        long_name: inputs.city?.value || '',
        short_name: inputs.cityShort?.value || ''
      },
      geoData: {
        lat: parseFloat(inputs.latitude?.value || '0') || 0,
        lng: parseFloat(inputs.longitude?.value || '0') || 0
      }
    };
  }

  validate(data: LocationBlockData): boolean {
    return (
      typeof data.country === 'object' &&
      typeof data.locality === 'object' &&
      typeof data.geoData === 'object' &&
      typeof data.geoData.lat === 'number' &&
      typeof data.geoData.lng === 'number'
    );
  }
}
