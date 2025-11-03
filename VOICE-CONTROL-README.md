# 🎤 HOLO-TALK Voice Control Guide

## Problem Fixed: All Entities Had Same Voice (Samantha)

### What Was Wrong
- Voices load **asynchronously** in the browser
- Entities that spoke **before voices loaded** all defaulted to `availableVoices[0]` (Samantha)
- Once assigned, they kept that voice forever
- Result: **Everyone sounded the same!**

### What's Fixed Now
1. **No more Samantha fallback** - Entities wait for voices to load
2. **Random voice assignment** - Each entity gets a random voice from 47 available
3. **Deferred speech** - If voices aren't ready, speech is delayed 500ms and retried
4. **Voice hints from JSON** - You can now control voices via disc-data.json

---

## Available Voices (47 Total)

Your browser has these English voices available:

```
0: Samantha (en-US)
1: Aaron (en-US)
2: Albert (en-US)
3: Arthur (en-GB)
4: Bad News (en-US)
5: Bahh (en-US)
6: Bells (en-US)
7: Boing (en-US)
8: Bubbles (en-US)
9: Catherine (en-AU)
10: Cellos (en-US)
11: Daniel (en-GB)
12-13: Eddy (en-GB, en-US)
14-15: Flo (en-GB, en-US)
16: Fred (en-US)
17: Good News (en-US)
18: Gordon (en-AU)
19-20: Grandma (en-GB, en-US)
21-22: Grandpa (en-GB, en-US)
23: Jester (en-US)
24: Junior (en-US)
25: Karen (en-AU)
26: Kathy (en-US)
27: Martha (en-GB)
28: Moira (en-IE)
29: Nicky (en-US)
30: Organ (en-US)
31: Ralph (en-US)
32-33: Reed (en-GB, en-US)
34: Rishi (en-IN)
35-36: Rocko (en-GB, en-US)
37-38: Sandy (en-GB, en-US)
39-40: Shelley (en-GB, en-US)
41: Superstar (en-US)
42: Tessa (en-ZA)
43: Trinoids (en-US)
44: Whisper (en-US)
45: Wobble (en-US)
46: Zarvox (en-US)
```

---

## How to Control Voices in disc-data.json

### Method 1: Specify Voice by Name

Add `"voice_name"` to any element in `elements_in_scene`:

```json
{
  "id": "officer_main",
  "type": "Entity",
  "grid_symbol": "OF",
  "initial_grid_position": { "row": 5, "col": 5 },
  "voice_name": "Daniel"
}
```

- Case-insensitive
- Partial match (e.g., "daniel", "Dan", "DANIEL" all work)
- If not found, falls back to random

### Method 2: Specify Voice by Index

Use `"voice_index"` with a number 0-46:

```json
{
  "id": "clancy_main",
  "type": "Entity",
  "grid_symbol": "CL",
  "initial_grid_position": { "row": 7, "col": 5 },
  "voice_index": 15
}
```

### Method 3: Let It Be Random

Just don't specify either field:

```json
{
  "id": "apparatus_main",
  "type": "Location",
  "grid_symbol": "APP",
  "initial_grid_position": { "row": 4, "col": 5 }
}
```

---

## Voice Recommendations by Character Type

### 🏢 Authority Figures (Officer, Official)
- **Daniel** (en-GB) - Authoritative British
- **Arthur** (en-GB) - Formal, serious
- **Ralph** (en-US) - Deep, commanding

### 📄 Bureaucrats (Clancy, Filing Cabinets)
- **Aaron** (en-US) - Monotone, clerical
- **Albert** (en-US) - Dry, administrative
- **Kathy** (en-US) - Professional, organized

### 🤖 Apparatus / Machines
- **Fred** (en-US) - Robotic, fun
- **Zarvox** (en-US) - Classic robot voice
- **Bells** / **Boing** / **Cellos** - Musical, mechanical
- **Bad News** / **Good News** - Emotional machinery

### 🎓 Scholars / Intellectuals
- **Moira** (en-IE) - Irish, thoughtful
- **Catherine** (en-AU) - Australian, measured
- **Martha** (en-GB) - British, academic

### 👤 Guests / Visitors
- **Rishi** (en-IN) - Indian accent
- **Gordon** (en-AU) - Australian
- **Tessa** (en-ZA) - South African
- **Karen** (en-AU) - Australian casual

### 🎪 Comedic / Unusual
- **Bubbles** - High-pitched, bubbly
- **Whisper** - Quiet, secretive
- **Wobble** - Unstable, warbling
- **Jester** - Playful, mischievous
- **Trinoids** - Alien-like

### 👴👵 Elderly Characters
- **Grandma** (en-GB or en-US)
- **Grandpa** (en-GB or en-US)

---

## Testing Voices

### In Browser Console

Check available voices:
```javascript
window.speechSynthesis.getVoices().forEach((v, i) => {
  console.log(`${i}: ${v.name} (${v.lang})`);
});
```

### In holo-talk.html

1. Load your JSON file
2. Open browser console (F12)
3. Look for messages like:
   ```
   🎤 TTS: 47 voices available:
   🎤 Assigned random voice #23 "Jester" to entity "clancy_main"
   🎤 Using disc-data voice name "Daniel": "Daniel" for "officer_main"
   ```

### Voice Control Panel

- Click any entity's name in the chat log (the 🎤 icon)
- Test different voices
- Assign manually
- Changes persist until page reload

---

## Full Example: disc-data-voice-example.json

See the included `disc-data-voice-example.json` for a complete working example with:
- Voice by name (Daniel, Fred, Moira)
- Voice by index (15)
- Random voices (no specification)

Load it into holo-talk.html to hear the difference!

---

## Troubleshooting

### "All entities still have the same voice!"

**Solution:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R) to clear cache

### "Voice name not working"

Check console for warnings:
```
⚠️ Voice "Daniell" not found for "officer_main", using random
```

Common typos:
- "Samatha" → **Samantha**
- "Daniell" → **Daniel**
- "Mora" → **Moira**

### "Voices don't load on mobile"

Some mobile browsers have limited voice selection. iOS Safari typically has fewer voices than desktop Chrome.

### "Entity speaks but no voice assigned"

Check console logs. If you see:
```
⏸️ Deferring speech for "officer_main" until voices load...
```

The system is waiting for voices. This should only happen once at startup.

---

## Advanced: Voice Quality Settings

Currently set in `holo-talk.html` line ~1936:

```javascript
utterance.rate = 0.95;   // Speed (0.1 to 10)
utterance.pitch = 1.0;   // Pitch (0 to 2)
utterance.volume = 0.9;  // Volume (0 to 1)
```

You can modify these in the code for different effects!

---

**Enjoy your diverse cast of 47 voices! 🎭🎤**
