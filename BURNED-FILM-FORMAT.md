# Burned Film Format - Minimal Viewer Mode

## Philosophy

**Burned films are for SHARING, not EDITING.**

They strip away all production controls and leave only:
- The film
- Play/Pause/Reset
- Scene counter
- Dialogue chat

Perfect for mobile. Perfect for sharing. Just press play.

---

## Layout Comparison

### **STUDIO MODE** (holo-project.html)
```
┌─────────────────────────────────────────┐
│ 🎬 HOLO Project                         │
│ [Dropdown] [Load] [▶ PLAY] [⏸] [STEP]  │
│ [RESET] [◀PREV] [NEXT▶] [🎬] [📹] [🔊] │
├─────────────────────────────────────────┤
│                                         │
│          3D VIEWPORT                    │
│      [Camera Rail Controls]             │
│                                         │
├──────────────────┬──────────────────────┤
│ Timeline Panel   │ Chat Log             │
│ Scene: X         │ Entity dialogues     │
│ Turn: Y/Z        │ System messages      │
│ [Overview][Top]  │                      │
│ Load instructions│                      │
└──────────────────┴──────────────────────┘
```

### **BURNED MODE** (exported standalone)
```
┌─────────────────────────────────────────┐
│ The Sheep Parliament Decides            │
│ BURN ID: BURN-L4K9ZX2                   │
│                   [▶ PLAY] [⏸] [↺]      │
│ Scene: 2 | Turn: 5/11                   │
├─────────────────────────────────────────┤
│                                         │
│          3D VIEWPORT                    │
│         (clean, no overlays)            │
│                                         │
├─────────────────────────────────────────┤
│ Chat Log (Full Width)                   │
│ BEATRICE: I call this meeting...        │
│ GERALD: What fence? I'm eating.         │
│ [BEEP BEEP BEEP BEEP]                   │
└─────────────────────────────────────────┘
```

---

## What Gets Removed

### ❌ **Hidden in Burned Films:**
- Dropdown file selector
- Load custom button
- STEP button
- PREV/NEXT SCENE buttons
- CINEMATIC mode
- MULTI-CAM mode
- TTS toggle
- HELP button
- Camera rail overlay
- Timeline panel (left side)
- Camera control buttons
- Scene info in bottom panel
- Load instructions

### ✅ **Kept in Burned Films:**
- Film title
- Burn ID (for provenance)
- PLAY button (toggles to PAUSE)
- PAUSE button
- RESET button
- Scene counter (top bar)
- Turn counter (top bar)
- 3D viewport (clean)
- Chat log (dialogue only)

---

## Mobile-First Design

**Burned films are optimized for phones:**

```
┌──────────────────┐
│ Film Title       │
│ BURN-123         │
│      [▶] [⏸] [↺]│
│ Scene: 3 | 7/15  │
├──────────────────┤
│                  │
│   3D VIEWPORT    │
│                  │
│                  │
├──────────────────┤
│ CHAT LOG         │
│                  │
│ Dialogue scrolls │
│ automatically    │
└──────────────────┘
```

**Touch targets**:
- Buttons: 44×44px minimum
- Text: 14px+ (readable without zoom)
- Spacing: 8px gaps (easy to tap)

---

## Header Structure

**Top Row**: Title + Buttons
```html
<div style="display:flex;justify-content:space-between;">
  <div>
    <span style="font-size:20px;">The Sheep Parliament Decides</span>
    <div style="font-size:10px;">BURN ID: BURN-L4K9ZX2</div>
  </div>
  <div style="display:flex;gap:8px;">
    <button id="playBtn">▶ PLAY</button>
    <button id="pauseBtn">⏸</button>
    <button id="resetBtn">↺</button>
  </div>
</div>
```

**Second Row**: Counters
```html
<div style="padding:4px 16px;border-top:1px solid var(--line);">
  <span>Scene: <strong id="sceneNum">2</strong></span>
  <span>Turn: <strong id="turnNum">5</strong>/<strong id="turnTotal">11</strong></span>
</div>
```

---

## Auto-Play Behavior

**Burned films auto-play after 1 second:**

```javascript
window.addEventListener('load', () => {
  // ... setup minimal mode ...
  
  setTimeout(() => {
    loadData(EMBEDDED_DATA);
    setTimeout(play, 1000); // Auto-play!
  }, 500);
});
```

**User experience**:
1. Open burned HTML file
2. Film loads automatically
3. After 1 second → starts playing
4. Sit back and watch

---

## Chat Log Only

**Bottom panel = full-width chat:**

```
┌─────────────────────────────────────────┐
│ BEATRICE                                │
│ I call this meeting to order. We need  │
│ to discuss the fence situation.         │
├─────────────────────────────────────────┤
│ GERALD                                  │
│ What fence? I'm eating.                 │
├─────────────────────────────────────────┤
│ [BEEP BEEP BEEP BEEP]                   │
├─────────────────────────────────────────┤
│ BEATRICE                                │
│ WILL YOU STOP THAT! I'm trying to       │
│ LEAD here!                              │
└─────────────────────────────────────────┘
```

**No timeline scrubbing, no camera controls — just dialogue.**

---

## File Size

**Example**: `The-Sheep-Parliament-BURN-L4K9ZX2.html`

**Components**:
- Base viewer code: ~200 KB
- Embedded JSON data: ~10-50 KB (depends on film)
- **Total**: ~210-250 KB (single file)

**Portable**:
- Email attachment ✓
- USB drive ✓
- Cloud share ✓
- Works offline ✓
- No dependencies ✓

---

## Burn ID Format

**Pattern**: `BURN-{TIMESTAMP_BASE36}`

**Examples**:
- `BURN-L4K9ZX2` (Nov 3, 2025, 6:27am)
- `BURN-L4KA012` (Nov 3, 2025, 6:30am)
- `BURN-L4KB9XY` (Nov 3, 2025, 7:00am)

**Properties**:
- **Unique**: Timestamp ensures no collisions
- **Compact**: Base-36 encoding (0-9, A-Z)
- **Sortable**: Chronological order
- **Traceable**: Can reverse timestamp if needed

**Decoding** (if needed):
```javascript
const burnId = 'L4K9ZX2';
const timestamp = parseInt(burnId, 36);
const date = new Date(timestamp);
// Nov 3, 2025, 6:27am
```

---

## Use Cases

### **1. Share on Social**
```
"Check out this experimental narrative:
https://mysite.com/sheep-parliament-BURN-L4K9ZX2.html

Just open and press play 🎬"
```

### **2. Email Distribution**
```
Subject: New Film - "The Sheep Parliament Decides"
Attachment: The-Sheep-Parliament-BURN-L4K9ZX2.html (230 KB)

No installation needed. Just open in any browser.
```

### **3. Archive Collection**
```
films/
  ├── Interrogation-BURN-L4K8ABC.html
  ├── Black-Metal-BURN-L4K9DEF.html
  ├── Sheep-Parliament-BURN-L4K9ZX2.html
  └── Rootcare-BURN-L4KAGHI.html
```

### **4. Exhibition Kiosk**
- Load on tablet/phone
- Auto-plays in loop
- Minimal UI (just film)
- Touch to pause/reset

---

## Remix Workflow

**From burned film → back to studio:**

1. Open burned HTML in text editor
2. Find `EMBEDDED_DATA` section
3. Copy JSON
4. Open studio holo-project.html
5. Paste JSON or drag file
6. Edit → Re-burn

**Lineage tracking**:
```
Original: BURN-L4K9ZX2
  ↓ (edit scenes)
Remix 1: BURN-L4KA012
  ↓ (add entities)
Remix 2: BURN-L4KB9XY
```

---

## Comparison Table

| Feature | Studio Mode | Burned Mode |
|---------|-------------|-------------|
| **Purpose** | Create/edit | Share/watch |
| **Controls** | 12+ buttons | 3 buttons |
| **File selector** | Yes | No |
| **Camera controls** | Yes | No |
| **Timeline scrubbing** | Yes | No |
| **Scene navigation** | Yes | Auto |
| **TTS toggle** | Yes | Auto-on |
| **Chat log** | Right panel | Full width |
| **Auto-play** | No | Yes (1s delay) |
| **Mobile optimized** | Partial | Full |
| **File size** | N/A | 210-250 KB |
| **Dependencies** | JSON file | None (embedded) |

---

## Technical Implementation

**Minimal mode activation:**

```javascript
const MINIMAL_MODE = true;

if (MINIMAL_MODE) {
  // Remove controls
  document.getElementById('presetSelector')?.parentElement.remove();
  document.querySelector('.file-btn')?.remove();
  document.getElementById('stepBtn')?.remove();
  // ... etc
  
  // Simplify header
  header.innerHTML = `
    <div>Title + Burn ID + Buttons</div>
    <div>Scene: X | Turn: Y/Z</div>
  `;
  
  // Chat only
  bottom.innerHTML = `
    <div class="panel chat" style="grid-column:1/-1;">
      <div class="chat-log" id="chatLog"></div>
    </div>
  `;
  
  // Re-attach handlers
  playBtn.onclick = () => playing ? pause() : play();
}
```

---

## End Transmission (Burned Films)

**Burned films show simplified end credits:**

```
┌─────────────────────────────────────┐
│   END TRANSMISSION                  │
│                                     │
│   This film: BURN-L4K9ZX2          │
│                                     │
│   [↺ RESET TO WATCH AGAIN]         │
│                                     │
│   Made with HOLO Project            │
│   POML Constraint-Based Generation  │
└─────────────────────────────────────┘
```

**No export button** (already burned!)  
**No remix button** (view-only mode)

---

## Best Practices

### **When to Burn:**
✅ Finished film ready to share  
✅ Want single-file distribution  
✅ Mobile-first viewing  
✅ Exhibition/kiosk display  
✅ Archive preservation  

### **When NOT to Burn:**
❌ Still editing scenes  
❌ Need camera controls  
❌ Want to remix later (use studio mode)  
❌ Testing/debugging  

---

## Mobile Experience

**Vertical (portrait)**:
```
┌──────────────────┐
│ Title            │
│ BURN-123         │
│      [▶] [⏸] [↺]│
│ S:3 | 7/15       │
├──────────────────┤
│                  │
│                  │
│   3D VIEWPORT    │
│                  │
│                  │
├──────────────────┤
│                  │
│   CHAT LOG       │
│                  │
│                  │
└──────────────────┘
```

**Horizontal (landscape)**:
```
┌──────────────────────────────────────┐
│ Title BURN-123  [▶][⏸][↺] S:3 | 7/15│
├─────────────────┬────────────────────┤
│                 │                    │
│   3D VIEWPORT   │    CHAT LOG        │
│                 │                    │
└─────────────────┴────────────────────┘
```

---

## Summary

**Studio Mode**: Full production environment  
**Burned Mode**: Minimal playback viewer

**Workflow**:
1. Create film in studio mode
2. Press PLAY to preview
3. At END TRANSMISSION → 🔥 BURN & DOWNLOAD
4. Share standalone HTML file
5. Recipients open → auto-plays → minimal UI

**Result**: Films that are **portable, minimal, mobile-friendly, and just work.** 🔥🎬
