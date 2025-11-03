# HOLO Project

**Spatial narrative viewer and generator for constraint-based film-making.**

[![Live Demo](https://img.shields.io/badge/demo-live-56ff9f)](https://hartswf0.github.io/holo-project/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## 🎬 What is this?

HOLO Project is a web-based tool for creating and viewing **spatial narratives** - films that unfold on a 3D grid where entities move, speak, and interact according to constraint-based choreography.

**Live Demo**: [https://hartswf0.github.io/holo-project/](https://hartswf0.github.io/holo-project/)

---

## ✨ Features

### **Viewer** (`holo-project.html`)
- 3D grid-based spatial narrative playback
- Entity choreography with smooth animations
- Text-to-Speech dialogue
- Camera controls (overview, top, side, follow)
- Scene transitions with title cards
- Mobile-responsive interface
- **Export feature**: Burn films to standalone HTML

### **Generator** (`thousand-tetrad.html`)
- AI-powered narrative generation
- McLuhan's Tetrad framework integration
- LEGOS spatial entity system
- Multi-channel conversations
- Ring memory for persistence

### **Formats**
- **POML**: Projection-Oriented Markup Language for constraint-based narratives
- **Disc-Data**: High-fidelity scene descriptions with precise timing
- **LEGOS**: AI-generated spatial dynamics

---

## 🚀 Quick Start

### **Option 1: View Online**
Just visit: [https://hartswf0.github.io/holo-project/](https://hartswf0.github.io/holo-project/)

### **Option 2: Local Development**
```bash
# Clone the repo
git clone https://github.com/hartswf0/holo-project.git
cd holo-project

# Serve locally (needs a web server for CORS)
python3 -m http.server 8000
# or
npx serve

# Open http://localhost:8000
```

---

## 📱 Usage

### **Watch a Film**
1. Open `holo-project.html`
2. Select a film from the dropdown (14 available!)
3. Press **▶ PLAY**
4. Sit back and watch

### **Export a Film**
1. Load any film
2. Play to the end (END TRANSMISSION)
3. Click **🔥 BURN & DOWNLOAD**
4. Get a standalone HTML file (~50-100 KB)
5. Share it anywhere!

### **Generate New Films**
1. Open `thousand-tetrad.html`
2. Use AI to create spatial narratives
3. Export as JSON
4. Load in `holo-project.html`

---

## 📚 Documentation

- **[POML Specification](disc-data-poml-experimental.md)** - Constraint language
- **[Burned Film Format](BURNED-FILM-FORMAT.md)** - Minimal viewer for sharing
- **[Experimental Film Generation](EXPERIMENTAL-FILM-GENERATION.md)** - Case study
- **[Projection System](README-PROJECTION-SYSTEM.md)** - Generator→Projector architecture
- **[Viewer Guide](README-VIEWER.md)** - Full feature documentation

---

## 🎥 Available Films

### **Full Simulations**
- **Interrogation Chamber** - 10 scenes, sci-fi interrogation
- **Black Metal: Cosmic Alchemy** - 6 scenes, Afrofuturism
- **The Sheep Parliament Decides** - 4 scenes, comedy with worldbuilding

### **Ethnographic Studies**
- **The First of Us** - Brooklyn, zombie cosmology
- **Afrotectopia Gathering** - Community workshop

### **Training Grounds**
- Shedding, Integrating, Grounding (abstract practices)

### **Experimental**
- **Rootcare After Collapse** - Thick description, multispecies

### **Synthetic Tests**
- Minimal, Pentagon, Apparatus Chorus, Sheep Consent Dashboard

---

## 🔥 Burn & Share

**Export any film to a standalone HTML file:**

1. Minimal UI (just Play/Pause/Reset)
2. Auto-plays on load
3. Unique Burn ID for provenance
4. Single file (~50-100 KB)
5. No dependencies (Three.js from CDN)
6. Works offline after first load

**Example**: `The-Sheep-Parliament-BURN-L4K9ZX2.html`

---

## 🛠️ Tech Stack

- **Three.js** - 3D rendering
- **Tone.js** - Audio synthesis
- **Web Speech API** - Text-to-Speech
- **Vanilla JavaScript** - No build system
- **POML** - Constraint-based narrative language

---

## 📐 Architecture

```
┌─────────────────────────────────────┐
│  thousand-tetrad.html               │
│  (Generator)                        │
│  - AI-powered                       │
│  - Tetrad framework                 │
│  - Creates LEGOS/Disc-Data          │
└──────────────┬──────────────────────┘
               │
               │ JSON
               ↓
┌─────────────────────────────────────┐
│  holo-project.html                  │
│  (Projector)                        │
│  - Cinematic playback               │
│  - 3D grid rendering                │
│  - TTS & animations                 │
└──────────────┬──────────────────────┘
               │
               │ Export
               ↓
┌─────────────────────────────────────┐
│  Burned Film (standalone HTML)      │
│  - Minimal viewer                   │
│  - Embedded data                    │
│  - Mobile-first                     │
└─────────────────────────────────────┘
```

---

## 📱 Mobile Support

- **Responsive layout** with 3 breakpoints
- **Touch-friendly** controls
- **Optimized viewport** (60-70% screen height)
- **Compact UI** on narrow screens
- **Auto-play** for passive viewing

---

## 🧪 Experimental Features

- **POML constraints** - Spatial/temporal rules for generation
- **Entity choreography** - Smooth transitions between scenes
- **Intensity-based effects** - Grid pulses, ambient particles
- **Multi-cam mode** - Split-screen views
- **Title cards** - Full-screen scene announcements
- **Burn ID provenance** - Unique identifiers for shared films

---

## 🎓 Research Context

HOLO Project explores:
- **Constraint-based generation** (vs prompt engineering)
- **Spatial narrative** (position as meaning)
- **Pre-literate interfaces** (McLuhan's tetrad via D-pad)
- **Stigmergic memory** (environment as communication)
- **Multispecies worldbuilding** (non-human perspectives)

---

## 🤝 Contributing

This is an experimental research project. If you want to:
- Add new films → Create JSON in POML format
- Fix bugs → Open an issue or PR
- Extend features → Fork and experiment!

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🔗 Links

- **Live Demo**: [https://hartswf0.github.io/holo-project/](https://hartswf0.github.io/holo-project/)
- **GitHub**: [https://github.com/hartswf0/holo-project](https://github.com/hartswf0/holo-project)
- **Documentation**: [Index](index.html) | [POML Spec](disc-data-poml-experimental.md)

---

## 🎬 Credits

**Direction**: Autonomous Systems  
**Cinematography**: Three.js Engine  
**Sound Design**: Tone.js Synthesizer  
**Voice Synthesis**: Web Speech API  

**Special Thanks**: Brian Eno • Laurie Anderson • Saul Bass • John Whitney • The Grid • The Entities

---

**Made with 🔥 in the DIRTY DISC archive**

*This has been a simulation. Thank you for watching.*
