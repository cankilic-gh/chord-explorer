# 🎹 Chord Explorer

**Master music theory with an interactive chord visualization tool.** Explore chords, voicings, progressions, and the CAGED system on piano and guitar.

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tone.js](https://img.shields.io/badge/Tone.js-15.x-FF6B6B?style=for-the-badge)](https://tonejs.github.io/)

🌐 **Live Demo:** [chords.thegridbase.com](https://chords.thegridbase.com)

---

## ✨ Features

### 🎵 Chord Visualization
- **Dual Display** - See chords on both piano and guitar fretboard simultaneously
- **Interactive Piano** - Click/tap piano keys to play individual notes
- **Interval Colors** - Root (red), 3rd (blue), 5th (green), 7th (orange) highlighted
- **Multiple Voicings** - Open positions, barre chords, and alternate fingerings
- **Real-time Audio** - Hear chords played with Tone.js audio engine

### 🎸 CAGED System
- **5 Position Learning** - See any chord in all CAGED positions (C-A-G-E-D shapes)
- **Dynamic Calculation** - Positions calculated for any root note
- **Visual Fretboard Map** - See how shapes connect across the neck
- **Educational Tips** - Turkish explanations for each shape

### 🔄 Circle of Fifths
- **Interactive View** - Full Circle of Fifths modal
- **Root Note Highlighting** - 4th and 5th intervals shown in chord selector
- **Key Relationships** - Understand harmonic connections

### 🎼 Progression Builder
- **Build Progressions** - Add up to 8 chords
- **Per-Chord Voicings** - Select different voicing for each chord
- **Pattern Detection** - Recognizes common progressions (Pop, Jazz, Blues, etc.)
- **BPM Control** - Adjustable tempo playback

### 🎯 Smart Features
- **Progressive Filtering** - Relative chords ranked by key compatibility
- **Compatible Keys Display** - See which keys fit your progression
- **Voicing Persistence** - Remembers voicing when changing chord type

### 📱 Mobile Responsive
- **Touch Optimized** - Full functionality on phones and tablets
- **Adaptive Layout** - Single column layout on mobile, 3-column on desktop
- **Collapsible Sections** - Related chords panel toggles on mobile
- **Horizontal Scroll** - Piano and chord selectors scroll smoothly

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser with Web Audio API support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cankilic-gh/chord-explorer.git
   cd chord-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
chord-explorer/
├── components/              # React components
│   ├── ChordSelector.tsx   # Root note & chord type selector
│   ├── Piano.tsx           # Piano keyboard visualization
│   ├── Fretboard.tsx       # Guitar fretboard display
│   ├── RelativeChords.tsx  # Diatonic chord cards
│   ├── ProgressionBuilder.tsx # Chord progression timeline
│   ├── CircleOfFifths.tsx  # Circle of Fifths modal
│   ├── CAGEDView.tsx       # CAGED system modal
│   └── MiniFretboard.tsx   # Compact fretboard for cards
├── lib/                     # Core logic
│   ├── musicTheory.ts      # Music theory calculations
│   ├── audioEngine.ts      # Tone.js audio playback
│   └── cagedSystem.ts      # CAGED position calculator
├── constants/
│   └── musicData.ts        # Chord formulas & voicings
└── App.tsx                  # Main application
```

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Audio** | Tone.js (Web Audio API) |
| **Deployment** | Vercel |

---

## 📖 Usage

### Exploring Chords

1. **Select Root Note** - Click on the chromatic circle (C, C#, D, etc.)
2. **Choose Chord Type** - Major, minor, 7th, maj7, dim, aug, etc.
3. **View on Instruments** - See notes on piano and guitar
4. **Switch Voicings** - Click voicing buttons to see different positions

### Using CAGED System

1. Click **CAGED** button in header
2. See all 5 positions for current chord
3. Click a shape to see details
4. Use **"Bu Pozisyonu Seç"** to apply

### Building Progressions

1. Click **+** on relative chord cards to add
2. Click chord in progression to change voicing
3. Adjust **BPM** slider
4. Press **Play** to hear progression

---

## 🎵 Music Theory

### Supported Chord Types

| Type | Symbol | Intervals |
|------|--------|-----------|
| Major | (none) | 1 - 3 - 5 |
| Minor | m | 1 - ♭3 - 5 |
| Dominant 7th | 7 | 1 - 3 - 5 - ♭7 |
| Major 7th | maj7 | 1 - 3 - 5 - 7 |
| Minor 7th | m7 | 1 - ♭3 - 5 - ♭7 |
| Diminished | dim | 1 - ♭3 - ♭5 |
| Diminished 7th | dim7 | 1 - ♭3 - ♭5 - ♭♭7 |
| Augmented | aug | 1 - 3 - ♯5 |

### CAGED Shapes

Each shape is derived from open chord fingerings:
- **C Shape** - Root on A string
- **A Shape** - Root on A string (most common barre)
- **G Shape** - Root on low E string
- **E Shape** - Root on low E string (barre chord foundation)
- **D Shape** - Root on D string

---

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
```

### Adding New Voicings

Edit `constants/musicData.ts`:

```typescript
export const GUITAR_VOICINGS: Record<string, VoicingDefinition[]> = {
  'C_Major': [
    { name: 'Open', frets: [0, 1, 0, 2, 3, -1], startFret: 0 },
    { name: 'Barre 3rd', frets: [3, 5, 5, 5, 3, -1], startFret: 3 },
  ],
  // ...
};
```

---

## 🚢 Deployment

Deployed on **Vercel** at [chords.thegridbase.com](https://chords.thegridbase.com)

```bash
npm run build  # Outputs to dist/
```

---

## 🎹 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile (works but optimized for desktop)

---

## 📝 License

MIT License - feel free to use and modify.

---

## 👤 Author

**Can Kilic**

- Portfolio: [cankilic.com](https://cankilic.com)
- GitHub: [@cankilic-gh](https://github.com/cankilic-gh)

---

## 🙏 Acknowledgments

- Audio powered by [Tone.js](https://tonejs.github.io)
- Built with [Vite](https://vitejs.dev) + [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

## 🎯 Roadmap

- [ ] Drag-and-drop progression reordering
- [ ] Scale visualization overlay
- [ ] MIDI export
- [ ] More chord types (sus2, sus4, add9, etc.)
- [ ] Metronome integration
- [ ] Save/load progressions
