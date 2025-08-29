# Social Media Integration

## Übersicht

Diese Integration ermöglicht es Benutzern, ihre Street Art Posts automatisch auf ihren Social Media Kanälen zu teilen. 

## Features

### 1. Social Media Account Management
- **Navigation**: Neuer "Social" Tab im Dashboard
- **Plattformen**: Twitter/X, Instagram, Facebook, LinkedIn
- **Einstellungen**: Username, Profile URL, API Access Tokens
- **Kontrolle**: Enable/Disable pro Account

### 2. Social Sharing im Editor
- **Share Button**: Erscheint nur bei veröffentlichten Posts mit aktiven Social Accounts
- **Custom Message**: Optional anpassbare Nachricht pro Share
- **Multi-Platform**: Auswahl mehrerer Plattformen gleichzeitig
- **Status Feedback**: Erfolg/Fehler Meldungen pro Plattform

## Setup

### Für Benutzer

1. **Dashboard → Social** aufrufen
2. **Add Account** klicken
3. **Plattform auswählen** (Twitter, Instagram, etc.)
4. **Account Details** eingeben:
   - Username (z.B. @username)
   - Profile URL (z.B. https://twitter.com/username)
   - **API Access Token** (siehe unten)
5. **Enable automatic posting** aktivieren
6. **Save Social Media Settings**

### API Access Tokens erhalten

#### Twitter/X
1. Gehe zu [developer.twitter.com](https://developer.twitter.com)
2. Erstelle eine neue App
3. Generiere Bearer Token
4. Kopiere den Token in die Einstellungen

#### Instagram
1. Verwende [Meta for Developers](https://developers.facebook.com)
2. Erstelle Instagram Basic Display API App
3. Erhalte Access Token über OAuth Flow

#### Facebook
1. Gehe zu [developers.facebook.com](https://developers.facebook.com)
2. Erstelle neue App
3. Aktiviere Facebook Login
4. Generiere Page Access Token

#### LinkedIn
1. Registriere deine App bei [developer.linkedin.com](https://developer.linkedin.com)
2. Erhalte Client ID und Secret
3. Implementiere OAuth 2.0 Flow

## Technische Implementation

### Komponenten
- `components/social-media-form.tsx` - Account Management
- `components/social-sharing-dialog.tsx` - Share Dialog im Editor
- `lib/firebase/social.ts` - API Integration und Datenbank
- `lib/models/User.ts` - Erweiterte User Schema

### Datenbank Schema
```typescript
socialMediaAccounts: [
  {
    platform: "twitter" | "instagram" | "facebook" | "linkedin",
    username: string,
    profileUrl: string,
    accessToken: string, // verschlüsselt gespeichert
    refreshToken: string,
    enabled: boolean
  }
]
```

### API Integrationen
- **Twitter API v2** - Tweet posting
- **Instagram Graph API** - Image/Story sharing
- **Facebook Graph API** - Page posting
- **LinkedIn API** - Company/Personal updates

## Sicherheit

- Access Tokens werden verschlüsselt in Firebase gespeichert
- Refresh Tokens für automatische Token-Erneuerung
- Rate Limiting pro Plattform berücksichtigt
- HTTPS für alle API Calls

## Zukünftige Erweiterungen

1. **OAuth Flow** - Automatische Token-Generierung
2. **Scheduling** - Zeitgesteuerte Posts
3. **Analytics** - Share Performance Tracking
4. **Templates** - Vorgefertigte Post-Templates
5. **Auto-Hashtags** - Automatische Hashtag-Generierung basierend auf Kunst-Kategorien

## Troubleshooting

### Share Button nicht sichtbar
- Post muss "Published" status haben
- Mindestens ein Social Account muss enabled sein
- Access Token muss gültig sein

### Sharing schlägt fehl
- API Token überprüfen
- Plattform-spezifische Limits beachten
- Internetverbindung prüfen
- Platform API Status überprüfen


