# Grid Projection Viewer - Universal Playback

**A mobile-friendly spatial timeline projector for multiple data formats**

## Features

✦ **Multi-Format Support**
- `disc-data.json` - Animated grid scenes with bubbles
- `legos-multi-channel.json` - Conversation threads with grid state
- `legos-ring-memory.json` - Timeline memory entries

✦ **Panel-Based Navigation**
- Each scene = swipeable panel (like channels in thousand-tetrad)
- Horizontal scroll with snap points
- Navigation dots at bottom

✦ **Grid + Timeline Layout**
- **Top 60%**: 9×9 spatial grid with power bars
- **Bottom 40%**: Timeline scrubber + event list
- Power distribution shown around grid edges

✦ **Playback Controls**
- ▶ Play/Pause timeline
- Speed: 0.5x → 1x → 2x → 4x
- Click timeline to seek
- Click event to jump + speak

✦ **Text-to-Speech**
- 🔊 Toggle TTS on/off
- Reads bubbles aloud during playback
- Speech rate matches playback speed
- Different pitch for thinking vs speech

✦ **Interactive Grid**
- Click any cell to inspect
- Occupied cells pulse
- Bubbles appear above entities
- Real-time power bar updates

## Usage

1. **Open** `projection-viewer.html` in browser
2. **Load** any supported JSON file:
   - `disc-data.json` (your grid animation scenes)
   - `legos-multi-channel-*.json` (conversation exports)
   - `legos-ring-memory-*.json` (timeline exports)
3. **Navigate** scenes with swipe or dots
4. **Play** timeline to see events unfold
5. **Inspect** cells for detailed data

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←/→` - Navigate scenes
- `↑/↓` - Adjust speed
- `T` - Toggle TTS
- `0-9` - Jump to scene number

## How Data Gets Projected

### disc-data.json
- Each `scene` → Panel with grid + timeline
- `animation_timeline` events → Timeline scrubber
- `thinking_bubble`/`speech_bubble` → Bubbles above grid
- `power_distribution` → Bars around grid

### legos-multi-channel.json
- Each `channel` → Multiple panels (grouped by ~5 messages)
- `messages` → Timeline events
- `grid` state → Spatial layout
- `scorecard` → Power distribution

### legos-ring-memory.json
- Grouped entries (5 per scene) → Panels
- Each `entry` → Timeline event
- `headline` + `summary` → Bubble text
- Memory context → Power bars

## Architecture

```
projection-viewer.html          Base HTML shell, panel container
projection-viewer-core.js       Data parsing, playback engine, TTS
```

## Mobile Optimizations

- Touch-friendly scroll snap
- Large tap targets (48px minimum)
- Responsive grid sizing
- Power bars adapt to screen size
- Timeline auto-scales events

## Next Steps

**Planned Enhancements:**
1. Better cell inspection (modal instead of alert)
2. Export playback as video
3. Custom speed per event type
4. Voice selection for TTS
5. Grid zoom/pan controls
6. Bookmark favorite scenes
7. Search events by text
8. Timeline annotations

## Example Workflow

```bash
# Load your grid animation
projection-viewer.html → disc-data.json

# Swipe through scenes
# Click Play to watch timeline
# Enable TTS to hear bubbles
# Click cells to inspect entities
# Adjust speed for detailed review
```

## Technical Notes

- Uses Web Speech API (Chrome/Safari)
- No dependencies (vanilla JS)
- All data processed client-side
- Supports files up to ~50MB
- 60fps timeline animation

---

**Built from:**
- `thousand-tetrad.html` - Panel system
- `nd-back-02.html` - Grid/timeline layout
- `grid-thinking-viewer.html` - Bubble animations

**Combines:** Mobile panels + spatial grid + temporal timeline + text-to-speech
