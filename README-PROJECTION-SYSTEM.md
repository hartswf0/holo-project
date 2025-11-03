# 🎬 Grid Projection System - Complete Guide

**The Generator → Projector Architecture**

This system consists of two complementary tools:
- **`thousand-tetrad.html`** - The Generator (creates spatial narratives)
- **`projection-viewer.html`** - The Projector (plays them back cinematically)

---

## 🎮 Part 1: Projection Viewer (The Projector)

### What It Does
The **Projection Viewer** is a cinematic playback engine that transforms spatial grid data into watchable, movie-like experiences. Think of it as a video player for grid-based narratives.

### Quick Start
1. Open `projection-viewer.html` in your browser
2. Click the **⊞ Load Data** button (bottom-right corner)
3. Select any supported JSON file:
   - `disc-data.json` (high-fidelity scenes)
   - `legos-multi-channel-*.json` (conversation threads)
   - `legos-ring-memory-*.json` (memory timelines)
4. The viewer auto-detects the format and renders it

### Interface Layout

```
┌────────────────────────────────────┐
│  ▶ Play    Scene Info ℹ   Settings ⚙│  ← Corner Controls
├────────────────────────────────────┤
│                                    │
│         🎯 SPATIAL GRID            │  ← Top: 9×9 Grid
│         E L X ✓ ~ ★                │     Entities/Locations/Obstacles
│         (Resizable)                │
│                                    │
├─────────── RESIZE BAR ─────────────┤  ← Drag to adjust
│                                    │
│  📊 Power Bars                     │  ← Bottom: Timeline/Chat
│  ─────────────────────             │
│  💬 Message Timeline               │     Time-based message flow
│  🔵 🟢 ⚪ Message Dots              │     Entity conversation
│                                    │
└────────────────────────────────────┘
     [Scene Selector ▼] [⊞ Grid]     ← Global Footer
```

### Key Features

#### 🎯 **Bi-Directional Chat ↔ Grid Binding**
- **Click message** → highlights entity on grid + animates cell
- **Click grid cell** → highlights all messages from that entity
- **Hover grid cell** → shows entity name/type tooltip
- Real-time synchronization with cellularAutomata loading animation

#### 🎬 **Cinematic Grid Display**
Each entity type has unique visual treatment:
- **E** (Entity) - Green pulse animation
- **L** (Location) - Blue beacon pulse
- **X** (Obstacle) - Red warning flash
- **✓** (Solution) - Green shimmer
- **~** (Shift) - Purple flow
- **★** (Goal) - Yellow beacon

#### ⏯️ **Playback Controls**
- **Play/Pause** (▶/⏸) - Top-left corner button
- **Speed** - 0.5x, 1x, 2x, 4x (in Settings ⚙)
- **Auto-Play Mode** - Plays all scenes sequentially
- **Keyboard Shortcuts**:
  - `Space` - Play/Pause
  - `←/→` - Navigate scenes
  - `↑/↓` - Adjust speed
  - `T` - Toggle text-to-speech
  - `0-9` - Jump to scene

#### 🎨 **Visual Options**
Toggle in Settings (⚙):
- **Entity Display**: COLOR (●) vs EMOJI (👮🧑📍)
- **Auto-Play Mode**: Sequential scene playback
- **Text-to-Speech**: Speaks message content

#### 📱 **Mobile Optimized**
- Safe-area-inset support (notch handling)
- Touch-friendly resize bar
- Swipeable scene panels
- Smooth scroll snap

---

## 🏭 Part 2: Thousand Tetrad (The Generator)

### What It Does
**Thousand-tetrad.html** is an AI-powered narrative generator that creates spatial grid representations of conversations. It uses McLuhan's Four Laws (Tetrad) to analyze media and generate LEGOS (spatial ontology) data.

### Quick Start
1. Open `thousand-tetrad.html` in browser
2. Add OpenRouter API key (click ◎ in top-right)
3. Select a scenario (or create custom)
4. Chat with the AI to generate scenes
5. Export via **⊞ SETTINGS** → **EXPORT JSON**

### What It Generates

#### **LEGOS Multi-Channel Data**
Conversation threads with spatial grid state:
```json
{
  "channels": [{
    "name": "CHALICE WO",
    "messages": [...],  // Conversation history
    "grid": [...],      // 9×9 spatial entity positions
    "scorecard": {...}, // Power distribution metrics
    "ledger": [...]     // Scene snapshots
  }]
}
```

#### **LEGOS Ring Memory Data**
Timeline-based memory entries:
```json
{
  "entries": [{
    "headline": "...",
    "summary": "...",
    "timestamp": "...",
    "ring": "R0001",
    "channelId": "..."
  }]
}
```

### Architecture Patterns to Study

**From `thousand-tetrad.html`** (lines to examine):
- **Grid Rendering** (~line 6000-6500): How cells are placed/animated
- **Message System** (~line 7500-8000): Dot rail + collapsible messages
- **Cultural Modes** (~line 2800-3000): Agent-based dynamics
- **Tetrad Generation** (~line 8400-8600): AI scene assembly
- **Visual Effects** (~line 550-750): cellularAutomata, entityPulse animations

**Key Features Ported to Projection Viewer:**
✅ Message dot rail (vertical scrolling dots)
✅ Collapsible message cards
✅ Entity-type specific animations
✅ Corner button system
✅ CSS variable theming
✅ Safe-area-inset support
✅ Cellular automata loading animation

---

## 📊 Part 3: Data Format Reference

### Format 1: disc-data.json (High-Fidelity Scenes)

**Purpose**: Frame-by-frame animation sequences with precise timing

**Structure**:
```json
{
  "story_title": "Grid Animation Title",
  "global_settings": {
    "grid_dimensions": { "rows": 9, "cols": 9 }
  },
  "scenes": [{
    "scene_number": 1,
    "title": "Scene Title",
    "initial_grid_layout": [...]  // 9x9 array
    "elements_in_scene": [{
      "id": "officer_main",
      "type": "Entity",
      "name": "Officer",
      "initial_grid_position": { "row": 5, "col": 5 }
    }],
    "power_distribution": {
      "officer": { "score": 0.8 },
      "clancy": { "score": 0.6 }
    },
    "animation_timeline": [{
      "event_id": "E001",
      "type": "speech_bubble",
      "target_element_id": "officer_main",
      "text": "Dialogue here",
      "display_type": "speech",
      "delay_seconds": 2.0,
      "duration_seconds": 4.0
    }]
  }]
}
```

**Use Case**: Authored narratives with precise control over timing and positioning

---

### Format 2: legos-multi-channel.json (Conversation Threads)

**Purpose**: AI-generated conversations with emergent spatial dynamics

**Source**: Exported from `thousand-tetrad.html` SETTINGS menu

**Structure**:
```json
{
  "exportedAt": "2025-11-02T00:30:10.662Z",
  "theme": "theme-crt",
  "channels": [{
    "id": "ch-1761054982994",
    "name": "CHALICE WO",
    "symbolicId": "CH00000002",
    "channelColor": "#56ff9f",
    "scenario": "chalice",
    "messages": [{
      "id": "M0001",
      "role": "system" | "user" | "assistant",
      "text": "Message content",
      "timestamp": "2025-10-21T13:56:31.680Z"
    }],
    "grid": [[{
      "symbol": "C",
      "entity": {
        "id": "chalice_wong",
        "type": "Entity",        // Entity, Location, Obstacle, Solution, Shift, Goal
        "name": "Chalice Wong",
        "location": "bedroom"
      }
    }]],
    "scorecard": {
      "officer": 0.5,
      "clancy": 0.7,
      "apparatus": 0.3
    },
    "ledger": [{
      "sceneTitle": "Rebirth of 1000 Lives",
      "sceneSummary": "...",
      "entities": [...],
      "gridMapping": [...]
    }]
  }]
}
```

**Entity Types in LEGOS**:
- **Entity** (E) - Characters, agents
- **Location** (L) - Places, spaces
- **Obstacle** (X) - Barriers, conflicts
- **Solution** (✓) - Resolutions, tools
- **Shift** (~) - Transformations, changes
- **Goal** (★) - Objectives, targets

**Use Case**: Organic conversations that generate spatial layouts dynamically

---

### Format 3: legos-ring-memory.json (Timeline Memory)

**Purpose**: Temporal memory entries across conversation threads

**Source**: Exported from `thousand-tetrad.html` SETTINGS menu

**Structure**:
```json
{
  "exportedAt": "2025-11-02T00:30:15.166Z",
  "ringId": "R0001",
  "ringName": "Ring 1",
  "entries": [{
    "id": "entry_1",
    "headline": "Memory Headline",
    "summary": "Detailed summary of event",
    "timestamp": "2025-10-21T20:30:48.172Z",
    "ring": "R0001",
    "channelId": "ch-1761054982994",
    "sceneSnapshot": { ... }
  }]
}
```

**Use Case**: Cross-channel memory/event tracking with temporal ordering

---

## 🎯 Workflow: Generator → Projector

### Creating Content (thousand-tetrad.html)

1. **Start Conversation**
   - Choose scenario or go custom
   - Chat with AI to develop narrative
   - Grid updates automatically as entities emerge

2. **Generate Scenes**
   - AI creates spatial layouts based on conversation
   - Entities positioned on 9×9 grid
   - Power dynamics tracked in scorecard

3. **Export Data**
   - Click **⊞ SETTINGS**
   - **EXPORT CHANNEL** → `legos-multi-channel-*.json`
   - **EXPORT RING MEMORY** → `legos-ring-memory-*.json`

### Playing Back (projection-viewer.html)

1. **Load Exported File**
   - Click **⊞** button
   - Select exported JSON

2. **Watch Cinematically**
   - Entities appear with type-specific animations
   - Messages flow in timeline
   - Power bars show dynamics

3. **Interact**
   - Click messages → see entities on grid
   - Click grid → see related messages
   - Enable auto-play for hands-free viewing

---

## 🎨 Visual Language

### Grid Symbols
```
E  - Entity (character, agent)       Green pulse
L  - Location (place, space)         Blue beacon
X  - Obstacle (barrier, conflict)    Red warning
✓  - Solution (resolution, tool)     Green shimmer
~  - Shift (transformation)          Purple flow
★  - Goal (objective, target)        Yellow beacon
```

### Message Indicators
```
● - Color dot (compact mode)
👮 - Emoji (readable mode)
1-99 - Message sequence number
```

### Power Distribution
```
Horizontal bars showing relative strength:
███████░░ 70% Officer
████░░░░░ 40% Apparatus
```

---

## 💡 Tips & Best Practices

### For Generating (thousand-tetrad)
- **Start with scenarios** - Built-in templates provide good structure
- **Let entities emerge naturally** - Don't force grid positions
- **Export frequently** - Save interesting conversation states
- **Use forks** - Branch conversations to explore alternatives

### For Viewing (projection-viewer)
- **Enable auto-play** - Great for presentations/demos
- **Use emoji mode** - More readable for accessibility
- **Resize grid** - Drag bar to focus on grid or chat
- **Collapse messages** - Click to hide/show individual messages
- **Click entities** - Explore grid/chat relationships interactively

---

## 🔧 Technical Architecture

### Generator (thousand-tetrad.html)
```
AI Chat Interface
    ↓
Scene Assembly (AI generates LEGOS ontology)
    ↓
Grid Placement (9×9 spatial positioning)
    ↓
Export JSON (multi-channel or ring-memory format)
```

### Projector (projection-viewer.html)
```
Load JSON
    ↓
Auto-Detect Format (disc-data / legos-multi / legos-ring)
    ↓
Parse & Render (scenes → panels)
    ↓
Playback Engine (timeline animation)
    ↓
Interactive Display (chat ↔ grid binding)
```

---

## 🚀 Advanced Features

### Auto-Play Mode
Plays all scenes sequentially without manual navigation. Perfect for:
- Demonstrations/presentations
- Reviewing long conversations
- Finding patterns across scenes

### Chat-Grid Binding
Bidirectional relationship between messages and entities:
- Message context → spatial understanding
- Grid position → conversation context
- Real-time highlighting with animations

### Entity-Type Animations
Each LEGOS entity type has cinematic treatment:
- **Locations** pulse like map markers
- **Obstacles** flash warnings
- **Solutions** shimmer with promise
- **Goals** beacon like waypoints

---

## 📁 File Reference

### Main Tools
- `projection-viewer.html` - The projector (playback)
- `projection-viewer-core.js` - Playback engine
- `thousand-tetrad.html` - The generator (creation)

### Data Files
- `disc-data.json` - High-fidelity authored scenes
- `legos-multi-channel-*.json` - Exported conversations
- `legos-ring-memory-*.json` - Exported memory timelines

### Documentation
- `PROJECTION-VIEWER-GUIDE.md` - Legacy guide (superseded by this)
- `README-PROJECTION-SYSTEM.md` - This comprehensive guide

---

## 🎓 Learning Path

1. **Start Simple** - Load a `legos-multi-channel` file in projection-viewer
2. **Explore Interactions** - Click messages, click grid cells
3. **Generate Your Own** - Use thousand-tetrad to create a simple scene
4. **Export & Play** - Round-trip your creation through both tools
5. **Study thousand-tetrad** - Examine grid animations and message system
6. **Create disc-data** - Author precise frame-by-frame sequences

---

## 🌟 The Philosophy

**thousand-tetrad** is the **generator** - it creates spatial narratives through AI conversation, capturing emergent entity relationships and power dynamics.

**projection-viewer** is the **projector** - it transforms these spatial narratives into cinematic, watchable experiences with entity animations and chat-grid binding.

Together they form a **creative loop**:
- Generate → Export → Project → Study → Generate again

The grid is not just data visualization - it's a **spatial thinking tool** where position, type, and relationships tell stories that linear text cannot.

---

**Built with:** Vanilla JavaScript, Web Speech API, CSS animations
**No dependencies** - Runs entirely in browser
**Mobile-ready** - Touch-optimized for phones/tablets
**AI-powered** - Uses OpenRouter API (thousand-tetrad only)
