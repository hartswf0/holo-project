# Grid Thinking Viewer - ASCII Game Edition

**A Bret Victor-inspired "Media for Thinking the Unthinkable" interface**

## 🎮 Game-Like Features

### Visual Design
- **CRT Monitor Aesthetic**: Scanline effect, vignette, phosphor glow
- **ASCII/Emoji Sprites**: Each element type has unique animated sprites
- **Particle System**: Living particles spawn during events and interactions
- **Color-Coded Entities**: Red officers, cyan Clancy, orange scholars, blue apparatus

### Animations
1. **Officer** (👮): Pulsing scale animation (1s cycle) - authority presence
2. **Clancy** (🧑): Bobbing rotation (1.5s cycle) - uncertain movement
3. **Scholar** (🎓): Walking side-to-side (0.8s cycle) - procession feel
4. **Apparatus** (⚙️): Continuous rotation (4s cycle) - mechanical operation
5. **Filing Cabinet** (🗄️): Shake on hover - reactive storage

### Interactive Elements
- **Grid Cells**: Hover scales 1.2x with intense glow
- **Timeline Scrubber**: Click to jump to any moment
- **Event List**: Click events to inspect and jump to timestamp
- **Particle Effects**: Spawn on movements, visual effects, and during playback

### Real-Time Dynamics
- **Power Distribution Bars**: Animate smoothly as authority shifts
- **Playhead**: Tracks current time position on timeline
- **Active Event Highlighting**: Shows which events are currently running
- **Thinking/Speech Bubbles**: Appear overlaid at exact timing

## 🎯 "Thinking the Unthinkable" Principles

### 1. Surfaces the Invisible
- **Power dynamics** visualized as real-time bar charts
- **Timeline events** shown as colored blocks (thinking=green, speech=blue, movement=orange)
- **Grid coordinates** overlaid on every cell
- **Hidden state** exposed through particle effects

### 2. Multiple Perspectives
- **Q1: Spatial Grid** - Top-down game view of 9×9 layout
- **Q2: Timeline** - Temporal view of all events
- **Q3: Power Distribution** - Abstract system dynamics
- **Q4: Data Inspector** - Raw JSON for selected elements

### 3. Interactive Thinking
- Scrub timeline to see grid state at any moment
- Click cells to inspect element data
- Play/pause to watch narrative unfold
- Adjust playback speed (0.5x to 4x)

### 4. Direct Manipulation
- Timeline is draggable scrubber
- Scene selector for instant jumping
- Event list items are clickable
- Grid cells respond to hover and click

### 5. Rapid What-If Exploration
- Change scenes instantly
- Jump to any time point
- Inspect any element's state
- Compare power distribution across scenes

## 🕹️ Controls

- **Scene Selector**: Jump between narrative scenes
- **Play/Pause Button**: Start/stop animation playback
- **Time Slider**: Scrub through scene duration
- **Speed Selector**: 0.5x, 1x, 2x, 4x playback speed
- **Timeline Click**: Jump to exact moment
- **Grid Cell Click**: Inspect element details

## 📊 Visual Legend

| Color | Entity Type | Animation |
|-------|-------------|-----------|
| 🔴 Red | Officer | Pulsing scale |
| 🔵 Cyan | Clancy | Bobbing rotation |
| 🟠 Orange | Scholar | Walking motion |
| 🔵 Blue | Apparatus | Spinning gears |
| 🟣 Purple | Filing Cabinet | Shake on hover |

## 🎨 Technical Stack

- **Pure HTML/CSS/JS** - No frameworks
- **Canvas-free particles** - DOM-based for retro feel
- **60fps animations** - requestAnimationFrame
- **Responsive layout** - 4-quadrant grid system
- **JSON data-driven** - Loads from disc-data.json

## 🚀 Usage

1. Open `grid-thinking-viewer.html` in browser
2. Data loads automatically from `disc-data.json`
3. Click Play to watch scenes unfold
4. Click any grid cell or timeline event to inspect
5. Scrub timeline to explore different moments
6. Switch scenes to see different configurations

## 🎭 Philosophy

The grid is not static—it's a living system. Each cell pulses, each character moves, particles flow through space. The interface doesn't just *show* the data—it *performs* it. The viewer becomes a stage where code, movement, and narrative converge into "media for thinking the unthinkable."

---

**Built with inspiration from:**
- Bret Victor's "Media for Thinking the Unthinkable"
- Classic ASCII roguelikes (NetHack, Dwarf Fortress)
- CRT monitor aesthetics
- Real-time strategy game interfaces
