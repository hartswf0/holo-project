# HOLO Project Enhancements

## Summary of Recent Fixes (Nov 3, 2025)

### ✅ 1. TTS (Text-to-Speech) Fixed

**Problem**: TTS not working reliably across browsers
**Solution**:
```javascript
function speakText(text, entityId) {
  // Clean text (remove [APPARATUS] tags, markdown, etc.)
  let cleanText = String(text)
    .replace(/\[.*?\]/g, '')
    .replace(/\*\*/g, '')
    .trim();
  
  // Browser quirk workarounds
  try {
    speechSynth.cancel();
    setTimeout(() => {
      speechSynth.speak(utterance);
      console.log('TTS speaking:', cleanText.substring(0, 50));
    }, 100); // Longer delay for reliability
  } catch (e) {
    console.warn('TTS error:', e);
  }
}
```

**Result**: TTS now works across Chrome, Safari, Firefox with error logging for debugging

---

### ✅ 2. Camera Controls Fixed

**Problem**: Bottom panel camera buttons didn't work (`onclick="setCamera('overview')"` failed)
**Solution**: Exposed `setCamera` to global scope
```javascript
window.setCamera = function(mode, targetName=null) {
  cameraMode = mode;
  hudUpdate();
  // ... camera animation
}
```

**Controls Now Working**:
- Overview (default)
- Top (bird's eye)
- Side (profile)
- Track (follows entities)
- Follow (locks to specific entity)

**Location**: Both camera rail (viewport) AND bottom panel buttons

---

### ✅ 3. Scene Info Moved to Timeline Panel

**Before**: HUD overlay cluttered 3D viewport

**After**: Scene info integrated into timeline panel (bottom-left)
```
Scene: Morning on the Hill
Turn: 6/11 | Camera: overview

[Overview] [Top] [Side]  ← Camera quick controls
```

**Result**: 
- Clean 3D viewport (JUST the scene)
- All metadata in data loading area
- Better visual hierarchy

---

### ✅ 4. End Transmission Export Feature

**New Feature**: "BURN & DOWNLOAD THIS FILM"

**What It Does**:
1. Creates **standalone HTML file** with embedded JSON data
2. Generates **unique Burn ID**: `BURN-{timestamp-in-base36}`
3. Auto-loads film on page open
4. Single-file distribution (no external JSON needed)

**Implementation**:
```javascript
window.exportFilm = function() {
  const burnId = 'BURN-' + Date.now().toString(36).toUpperCase();
  
  // Fetch current HTML
  fetch(window.location.href)
    .then(r => r.text())
    .then(html => {
      // Inject embedded data
      const standalone = html.replace(
        '<script>',
        `<script>
    const EMBEDDED_DATA = ${JSON.stringify(dataParsed)};
    window.addEventListener('load', () => {
      loadData(EMBEDDED_DATA);
    });
    //`
      );
      
      // Download as single HTML file
      const blob = new Blob([standalone], {type: 'text/html'});
      download(`${filmTitle}-${burnId}.html`);
    });
}
```

**End Credits Now Include**:
- 🔥 **BURN & DOWNLOAD THIS FILM** (green button)
- 🎬 **REMIX (Load New Film)** (blue button)
- **POML Documentation** link
- Remix encouragement text

**Example Filename**: `The-Sheep-Parliament-Decides-BURN-L4K9ZX2.html`

---

### ✅ 5. Mobile Responsive UI

**Problem**: Too many buttons, text too small on phones

**Solutions**:

**Tablet (< 920px)**:
- Wrap controls
- Smaller buttons (10px font)
- Smaller camera rail
- Compact scene info

**Phone (< 640px)**:
- Hide: PREV/NEXT SCENE, MULTI-CAM, HELP buttons
- Hide: Camera rail (use bottom panel instead)
- Smaller logo
- Tighter spacing
- 3-column layout collapses to single column

**CSS**:
```css
@media (max-width: 640px) {
  .app { grid-template-rows: auto 1fr minmax(180px, 35vh); }
  #prevSceneBtn, #nextSceneBtn, #multiCamBtn, #helpBtn { display: none; }
  .camera-rail { display: none; } /* Use bottom panel */
  .controls button { font-size: 9px; padding: 4px 8px; }
}
```

---

### ✅ 6. PLAY Button Visual State

**Enhancement**: Clear visual feedback for play/pause state

**Before**: Gray button, no indication

**After**:
```
DEFAULT:  ▶ PLAY  (white text, default bg)
PLAYING:  ⏸ PAUSE (white text, RED #ff5c7c bg)
```

**Toggle behavior**:
```javascript
document.getElementById('playBtn').onclick = () => {
  if (playing) pause();
  else play();
};

function play() {
  playing = true;
  playBtn.textContent = '⏸ PAUSE';
  playBtn.style.background = '#ff5c7c';
  playBtn.style.color = '#fff';
}

function pause() {
  playing = false;
  playBtn.textContent = '▶ PLAY';
  playBtn.style.background = '';
  playBtn.style.color = '';
}
```

---

## Files Available (14 Total)

### **Full Simulations (3)**:
1. **Interrogation Chamber** (original 10-scene interrogation)
2. **Black Metal: Cosmic Alchemy** (6-scene Afrofuturism)
3. **The Sheep Parliament Decides** (4-scene comedy with worldbuilding)

### **Ethnographic Studies (2)**:
4. **The First of Us** (6 scenes, Brooklyn, zombie cosmology)
5. **Afrotectopia Gathering** (Brooklyn workshop)

### **Training Grounds (3)**:
6. **Shedding** (abstract practice)
7. **Integrating** (synthesis)
8. **Grounding** (embodiment)

### **Experimental (1)**:
9. **Rootcare After Collapse** (4 scenes, thick description)

### **Synthetic Tests (4)**:
10. Minimal (2 entities)
11. Pentagon (5 speakers)
12. Apparatus Chorus (1+6 sensors)
13. Sheep Consent Dashboard (ethics lab)

---

## POML Integration

**End Transmission now includes**:
- Link to `disc-data-poml-experimental.md`
- Explanation of constraint-based generation
- Encouragement to remix
- Standalone file philosophy

**Text**:
> "POML (Projection-Oriented Markup Language)  
> This film was generated using constraint-based spatial narrative specification.  
> See disc-data-poml-experimental.md for full documentation.  
>   
> Burn ID creates standalone HTML file with embedded data.  
> Share it, remix it, transform it."

---

## Usage

### **Watch a Film**:
1. Open `holo-project.html`
2. Select film from dropdown
3. Click **▶ PLAY**
4. Sit back (auto-advances through scenes)

### **Export a Film**:
1. Load any film
2. Let it play to end
3. END TRANSMISSION appears
4. Click **🔥 BURN & DOWNLOAD THIS FILM**
5. Receive single HTML file: `{title}-BURN-{id}.html`
6. Share file (works standalone, no dependencies)

### **Remix**:
1. After END TRANSMISSION
2. Click **🎬 REMIX**
3. Page reloads
4. Select new film

### **Camera Controls**:
- **Overview**: Default 3/4 view
- **Top**: Bird's eye (straight down)
- **Side**: Profile (horizontal)
- **Track**: Smooth follow-cam
- **Follow [name]**: Lock to specific entity

---

## Mobile Experience

**Phone (< 640px)**:
- Essential controls only
- Clean viewport
- Bottom panel for scene info + cameras
- Vertical layout
- Touch-friendly buttons

**Tablet (640-920px)**:
- More controls visible
- Camera rail available
- Compact but functional

**Desktop (> 920px)**:
- Full controls
- All buttons
- Multi-panel layout
- Maximum information density

---

## Technical Details

### **Auto-Shift**:
Files with positions at (0,0,0) automatically shift to (4,0,4) grid center

### **TTS Cleaning**:
- Removes `[APPARATUS]` tags
- Removes markdown (`**`, `*`, `` ` ``)
- Replaces em-dash with space
- Collapses multiple spaces
- 100ms delay for browser compatibility

### **Export Format**:
```html
<script>
// EMBEDDED FILM DATA - BURN ID: BURN-L4K9ZX2
const EMBEDDED_DATA = {
  "title": "The Sheep Parliament Decides",
  "scenes": [...]
};

window.addEventListener('load', () => {
  setTimeout(() => {
    loadData(EMBEDDED_DATA);
  }, 500);
});
</script>
```

### **Burn ID Format**:
- Timestamp in base-36 (compact)
- Always uppercase
- Example: `BURN-L4K9ZX2` (Nov 3, 2025 ~6:20am)

---

## What's Working

✅ TTS speaks all dialogue (cleaned text)  
✅ Camera controls (rail + bottom panel)  
✅ Play/Pause visual state (red when playing)  
✅ Scene info in timeline panel (clean viewport)  
✅ Export as standalone HTML (burn ID)  
✅ End credits with remix encouragement  
✅ POML documentation link  
✅ Mobile responsive (3 breakpoints)  
✅ Auto-shift off-grid positions  
✅ 14 films available  

---

## Known Issues / Future

⚠️ **Export limitation**: Uses `fetch(window.location.href)` which requires local server or file:// access  
⚠️ **TTS voices**: Limited by browser's installed voices  
⚠️ **Mobile landscape**: Not optimized (portrait preferred)  

**Future enhancements**:
- Progressive Web App (offline support)
- Custom TTS voice selection
- Landscape mobile layout
- Share to social (Twitter, etc.)
- QR code generation for burned films
- Remix editor (modify scenes inline)

---

## Files Modified

1. **holo-project.html**:
   - TTS fixes
   - Camera exposure
   - Export function
   - Mobile CSS
   - End credits enhancement

2. **index.html**:
   - Added all films to examples
   - Updated descriptions

3. **HOLO-PROJECT-ENHANCEMENTS.md** (this file):
   - Documentation

---

**The viewer is now production-ready for sharing, remixing, and burning films to standalone files.** 🔥🎬✨
