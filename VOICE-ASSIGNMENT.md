# Voice Assignment System

## Overview

Each entity (speaker) in HOLO Project now gets a **unique voice** from the browser's available Text-to-Speech voices.

---

## How Many Voices?

**It depends on your browser and operating system:**

### **macOS (Safari/Chrome)**
- **~70-90 voices** total
- **~30-40 English voices**
- Includes: Samantha, Alex, Fred, Victoria, Karen, Daniel, etc.
- Quality: High (macOS native voices)

### **macOS Voice Examples**
```
0: Alex (en-US)           - Male, smooth
1: Samantha (en-US)       - Female, clear
2: Fred (en-US)           - Male, character voice
3: Victoria (en-US)       - Female, formal
4: Karen (en-AU)          - Female, Australian
5: Daniel (en-GB)         - Male, British
6: Moira (en-IE)          - Female, Irish
7: Fiona (en-scotland)    - Female, Scottish
... and many more
```

### **Windows (Edge/Chrome)**
- **~50-70 voices** total
- **~20-30 English voices**
- Includes: Microsoft David, Zira, Mark, etc.

### **Linux (Chrome/Firefox)**
- **~10-20 voices** (varies by distro)
- **~5-10 English voices**
- Quality: Varies

### **iOS Safari**
- **~60+ voices**
- **~30 English voices**
- Same as macOS (Samantha, Alex, etc.)

### **Android Chrome**
- **~30-50 voices**
- **~15-20 English voices**
- Google TTS engine

---

## Voice Assignment Logic

```javascript
function getVoiceForEntity(entityId) {
  // Already assigned? Return cached voice
  if (entityVoices.has(entityId)) {
    return entityVoices.get(entityId);
  }
  
  // Assign next available voice (round-robin)
  const voiceIndex = entityVoices.size % availableVoices.length;
  const voice = availableVoices[voiceIndex];
  entityVoices.set(entityId, voice);
  
  console.log(`🎤 Assigned voice "${voice.name}" to entity "${entityId}"`);
  return voice;
}
```

**Round-robin assignment:**
- Entity 1 → Voice 0
- Entity 2 → Voice 1
- Entity 3 → Voice 2
- ...
- Entity 31 → Voice 30
- Entity 32 → Voice 0 (cycles back)

---

## Console Logging

### **On Page Load**
```
🎤 TTS: 67 voices available:
  0: Alex (en-US)
  1: Alice (it-IT)
  2: Alva (sv-SE)
  3: Amelie (fr-CA)
  4: Anna (de-DE)
  5: Carmit (he-IL)
  ...
  66: Yuna (ko-KR)
```

### **When Entity Speaks**
```
🎤 Assigned voice "Samantha" to entity "BEATRICE"
🎤 TTS [BEATRICE]: I call this meeting to order. We ne...

🎤 Assigned voice "Alex" to entity "GERALD"
🎤 TTS [GERALD]: What fence? I'm eating...

🎤 Assigned voice "Fred" to entity "MARJORIE"
🎤 TTS [MARJORIE]: WILL YOU STOP THAT! I'm trying to L...
```

### **System Messages**
```
🎤 TTS [system]: Scene 1. Morning on the Hill...
🎤 TTS [system]: Movie complete
```

---

## Testing Voice Availability

**Open browser console** (F12) and run:

```javascript
// Get all voices
const voices = window.speechSynthesis.getVoices();

// Filter English voices
const enVoices = voices.filter(v => v.lang.startsWith('en'));

// Log them
console.log(`Total voices: ${voices.length}`);
console.log(`English voices: ${enVoices.length}`);
enVoices.forEach((v, i) => {
  console.log(`${i}: ${v.name} (${v.lang})`);
});
```

---

## Example Cast with Voices

**The Sheep Parliament Decides (4 entities)**:

```
BEATRICE  → Samantha (en-US)  - Female, authoritative
GERALD    → Alex (en-US)      - Male, relaxed
MARJORIE  → Victoria (en-US)  - Female, dramatic
CLEMENTINE → Daniel (en-GB)   - Male, British
```

**Black Metal: Cosmic Alchemy (6 entities)**:

```
Ari             → Samantha (en-US)
Film-Being      → Fred (en-US)      - Character voice
Practitioners-1 → Victoria (en-US)
Practitioners-2 → Karen (en-AU)     - Australian accent
Practitioners-3 → Moira (en-IE)     - Irish accent
Mycelia-Network → Fiona (en-scotland) - Scottish accent
```

**Interrogation Chamber (2 entities)**:

```
SUBJECT         → Alex (en-US)      - Male, calm
INTERROGATOR    → Samantha (en-US)  - Female, clinical
[APPARATUS]     → [system voice]    - No TTS (visual only)
```

---

## Voice Persistence

Voices are **cached per entity** in `entityVoices` Map:

```javascript
const entityVoices = new Map();
// Persists for entire session
// Each entity keeps same voice across scenes
```

**Example**:
- Scene 1: BEATRICE gets "Samantha"
- Scene 2: BEATRICE still uses "Samantha"
- Scene 3: BEATRICE still uses "Samantha"

**Consistency across film!**

---

## Voice Quality Tiers

### **Tier 1: macOS Native (Best)**
- Alex, Samantha, Victoria, Fred
- Natural intonation
- Clear pronunciation
- Expressive

### **Tier 2: Google/Microsoft (Good)**
- Modern neural voices
- Clear but less natural
- Limited intonation

### **Tier 3: Basic Synth (Functional)**
- Robotic sound
- Basic pronunciation
- Minimal expression

---

## Customization Options

### **Current Settings**
```javascript
utterance.rate = 0.9;    // 90% speed (slightly slower for clarity)
utterance.volume = 0.7;  // 70% volume (not too loud)
utterance.pitch = 1.0;   // Normal pitch
```

### **Future Enhancements**
- Pitch variation per entity (e.g., BEATRICE higher, GERALD lower)
- Rate variation (e.g., anxious characters speak faster)
- Volume variation (e.g., whispers, shouts)
- Gender-based voice selection
- Accent-based voice selection (British for UK entities, etc.)

---

## Browser Support

| Browser | Platform | Voices | Quality |
|---------|----------|--------|---------|
| Safari | macOS | 67+ | ⭐⭐⭐⭐⭐ |
| Chrome | macOS | 67+ | ⭐⭐⭐⭐⭐ |
| Safari | iOS | 60+ | ⭐⭐⭐⭐⭐ |
| Edge | Windows | 50+ | ⭐⭐⭐⭐ |
| Chrome | Windows | 50+ | ⭐⭐⭐⭐ |
| Chrome | Android | 30+ | ⭐⭐⭐ |
| Firefox | Linux | 10+ | ⭐⭐ |

---

## Limitations

1. **Voice availability varies** by OS/browser
2. **No custom voices** (limited to system-installed)
3. **Quality varies** across platforms
4. **Accent/gender can't be guaranteed** (depends on available voices)
5. **First voice might be default** if voices not loaded yet

---

## Debugging

### **Check Voices in Console**
Press `F12` → Console → Reload page → Look for:
```
🎤 TTS: 67 voices available:
  0: Alex (en-US)
  1: Samantha (en-US)
  ...
```

### **Check Entity Assignments**
Play film → Console shows:
```
🎤 Assigned voice "Samantha" to entity "BEATRICE"
🎤 Assigned voice "Alex" to entity "GERALD"
```

### **Common Issues**

**No voices available?**
```javascript
// Reload voices manually:
speechSynthesis.getVoices(); 
// Wait 100ms, try again
```

**All entities same voice?**
```javascript
// Check if entityId is being passed:
speakText(text, entityId); // ✅ Correct
speakText(text);           // ❌ Wrong (uses default)
```

---

## Voice Testing UI

### **Click to Test**

All speaker names in the chat are now **clickable** with a 🎤 mic icon!

**Click any speaker name** → Opens voice panel with:
- Current assigned voice
- Test button (speaks random test phrase)
- List of ALL available voices
- Click any voice to assign + test it

### **Side Panel Features**

```
┌─────────────────────────┐
│ ✕                       │
│ BEATRICE 🎤             │
├─────────────────────────┤
│ Current Voice:          │
│ Samantha (en-US)        │
├─────────────────────────┤
│ [🎤 Test Current Voice] │
├─────────────────────────┤
│ All Available Voices:   │
│ 67 English voices       │
├─────────────────────────┤
│ • Alex (en-US)          │
│ • Samantha (en-US) ✓    │
│ • Fred (en-US)          │
│ • Victoria (en-US)      │
│ ... (scroll for more)   │
└─────────────────────────┘
```

**Workflow:**
1. Film plays → Character speaks
2. See "BEATRICE 🎤" in chat log
3. Click name → Side panel slides in
4. Click "Test" → Hear current voice
5. Browse list → Click different voice
6. New voice auto-assigns + tests
7. Close panel → Voice persists

### **Test Phrases**

Random test phrases include:
- "Hello, I'm testing my voice."
- "How do I sound?"
- "This is what I'll sound like in the film."
- "Can you hear me clearly?"

### **Manual Assignment**

You can override auto-assignment:
1. Click speaker name
2. Scroll voice list
3. Click preferred voice
4. Voice immediately assigned + tested
5. Persists for all scenes

---

## Summary

- **Voice count**: 10-90 depending on platform
- **Assignment**: Round-robin auto-assign OR manual selection
- **Best experience**: macOS Safari/Chrome (67+ voices)
- **Logging**: Console shows all assignments
- **Consistency**: Same entity = same voice across scenes
- **Testing UI**: Click speaker names → test/change voices
- **Verification**: Side panel shows current assignments

**Result**: Each character sounds distinct, making dialogue easier to follow! Plus you can test and customize voices per character! 🎤✨
