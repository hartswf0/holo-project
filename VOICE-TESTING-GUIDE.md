# Voice Testing & Assignment Guide

## The Problem You Reported

**Console showed:**
```
🎤 TTS: 47 voices available
🎤 Assigned voice #0 "Samantha" to entity "sheep_beatrice"
🎤 TTS [sheep_beatrice]: I call this meeting to order...
```

**But**: No audio heard! ❌

---

## Root Cause: Browser Audio Blocking

**Browsers block audio until user interacts with page.**

This is a security feature - websites can't auto-play sounds without permission.

---

## Solution: 🎤 VOICES Button

### **New Feature Added**

**Orange button in header**: `🎤 VOICES`

### **What It Does**

1. **Lists all entities** in current film
2. **Shows assigned voice** for each (or "Not assigned yet")
3. **Dropdown to select** from 47 voices
4. **TEST button** - Click to hear voice (enables audio)
5. **ASSIGN button** - Save voice choice

---

## How To Use

### **Step 1: Load Film**
```
1. Select film from dropdown (e.g., "The Sheep Parliament Decides")
2. Film data loads
3. Console shows: "🎤 TTS: 47 voices available"
```

### **Step 2: Open Voice Panel**
```
1. Click 🎤 VOICES button (orange, top right)
2. Full-screen panel opens
3. See all entities listed:
   - BEATRICE
   - GERALD  
   - PENELOPE
   - MAURICE
```

### **Step 3: Test Voices**
```
For each entity:
1. Click dropdown → Select voice
   - Samantha (en-US)
   - Aaron (en-US)
   - Fred (en-US)
   - etc.

2. Click 🔊 TEST button
3. Hear: "BEATRICE: Hello, I'm testing my voice."
4. Try different voices!

5. Like it? Click ✓ ASSIGN button
6. Voice saved for that entity
```

### **Step 4: Close Panel & Play**
```
1. Click ✕ Close
2. Press ▶ PLAY
3. Now audio works!
4. Each entity speaks with assigned voice
```

---

## Voice Panel Layout

```
┌─────────────────────────────────────────┐
│ 🎤 Voice Control Panel         [✕ Close]│
├─────────────────────────────────────────┤
│ ⚠️ Browser Audio: Click TEST to enable  │
├─────────────────────────────────────────┤
│ Available Voices: 47 voices found       │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ BEATRICE                            │ │
│ │ Entity ID: sheep_beatrice           │ │
│ │ Voice: [Samantha ▼] [🔊 TEST]      │ │
│ │                     [✓ ASSIGN]     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ GERALD                              │ │
│ │ Entity ID: sheep_gerald             │ │
│ │ Voice: [Aaron ▼]    [🔊 TEST]      │ │
│ │                     [✓ ASSIGN]     │ │
│ └─────────────────────────────────────┘ │
│ ...                                     │
└─────────────────────────────────────────┘
```

---

## Testing Each Voice

### **Click 🔊 TEST button:**

**What happens:**
```javascript
1. Reads dropdown value
2. Gets selected voice
3. Creates utterance: "BEATRICE: Hello, I'm testing my voice."
4. Speaks with that voice
5. Console logs: 🎤 Testing voice "Samantha": BEATRICE: Hello...
```

**Test phrases (random):**
- "Hello, I'm testing my voice."
- "How do I sound?"
- "This is what I'll sound like in the film."
- "Can you hear me clearly?"

---

## Voice Assignment

### **Auto-Assignment (Round-Robin)**

**Before you click ASSIGN:**
```
Entity 1 (BEATRICE)  → Voice 0 (Samantha)
Entity 2 (GERALD)    → Voice 1 (Aaron)
Entity 3 (PENELOPE)  → Voice 2 (Albert)
Entity 4 (MAURICE)   → Voice 3 (Arthur)
```

### **Manual Assignment**

**After you click ASSIGN:**
```
BEATRICE → You picked Fred
GERALD   → You picked Moira
PENELOPE → You picked Whisper
MAURICE  → You picked Zarvox
```

**Persists across:**
- ✅ All scenes
- ✅ Page reloads (if you reassign)
- ✅ Different films (entity IDs match)

---

## Available Voices (47 on macOS)

### **Normal Voices**
- Samantha (en-US) - Female, clear
- Aaron (en-US) - Male, news anchor
- Catherine (en-AU) - Female, Australian
- Daniel (en-GB) - Male, British
- Karen (en-AU) - Female, Australian
- Moira (en-IE) - Female, Irish
- Tessa (en-ZA) - Female, South African

### **Character Voices**
- Fred (en-US) - Male, character voice
- Ralph (en-US) - Male, gravelly
- Albert (en-US) - Male, older
- Kathy (en-US) - Female, friendly
- Nicky (en-US) - Female, young
- Junior (en-US) - Child voice

### **Novelty Voices**
- Bad News (en-US) - Robot
- Bahh (en-US) - Goat/sheep
- Bells (en-US) - Musical
- Boing (en-US) - Spring sound
- Bubbles (en-US) - Underwater
- Cellos (en-US) - Musical
- Good News (en-US) - Robot
- Jester (en-US) - Silly
- Organ (en-US) - Musical
- Superstar (en-US) - Announcer
- Trinoids (en-US) - Multiple voices
- Whisper (en-US) - Quiet
- Wobble (en-US) - Unstable
- Zarvox (en-US) - Alien robot

---

## Why Audio Wasn't Working

### **Browser Security**

Modern browsers block audio until user clicks something.

**Before fix:**
```
Film auto-plays
→ TTS tries to speak
→ Browser blocks it
→ No error shown
→ Silent film ❌
```

**After fix:**
```
User clicks 🔊 TEST
→ Browser allows audio
→ Test phrase plays
→ Audio enabled
→ Film plays with voices ✅
```

---

## Console Messages Explained

### **On Page Load**
```
🎤 TTS: 47 voices available:
  0: Samantha (en-US)
  1: Aaron (en-US)
  ...
💡 TIP: Click speaker names (🎤) to test voices!
```

### **Auto-Assignment (First Speech)**
```
🎤 Assigned voice #0 "Samantha" to entity "sheep_beatrice"
```

### **When Speaking**
```
🎤 TTS [sheep_beatrice]: I call this meeting to order...
🔊 Attempting to speak... {
  voiceSet: true,
  voiceName: "Samantha",
  text: "I call this meeting to order"
}
```

### **If Blocked**
```
❌ TTS speak error: NotAllowedError
🚨 Browser may be blocking audio. Click TEST button to enable.
```

### **Manual Assignment**
```
🎤 Manually assigned voice "Fred" to entity "sheep_beatrice"
```

---

## Testing Workflow

### **Complete Test Process**

```
1. Load "The Sheep Parliament Decides"
   → Console: 47 voices available

2. Click 🎤 VOICES button
   → Panel opens

3. For BEATRICE:
   - Dropdown shows "Samantha" (auto-assigned)
   - Click 🔊 TEST
   - Hear: "BEATRICE: Hello, I'm testing my voice."
   - Try "Fred" from dropdown
   - Click 🔊 TEST
   - Hear Fred's voice
   - Like it! Click ✓ ASSIGN

4. For GERALD:
   - Select "Moira" (Irish accent)
   - Click 🔊 TEST
   - Click ✓ ASSIGN

5. Close panel (✕)

6. Press ▶ PLAY
   → BEATRICE speaks with Fred's voice
   → GERALD speaks with Moira's voice
   → Audio works! ✓
```

---

## Mobile Support

**Voice panel is responsive:**

### **Desktop**
- Full overlay
- 800px max width
- Two-column layout (info + buttons)

### **Mobile**
- Full screen
- Single column
- Stack vertically
- Scrollable list
- Touch-friendly buttons

---

## Troubleshooting

### **No voices showing**
```
Problem: "Loading..." never changes
Solution: 
- Wait 2-3 seconds
- Click 🎤 VOICES again
- Check console for voice count
```

### **TEST button silent**
```
Problem: Click TEST, no sound
Solution:
- Make sure volume is up
- Try different voice
- Check browser audio permissions
- Reload page
```

### **Film plays but silent**
```
Problem: Film plays, console shows TTS messages, but no audio
Solution:
- Click 🎤 VOICES
- Click any 🔊 TEST button
- Close panel
- Press PLAY again
```

### **Can't assign voice**
```
Problem: ✓ ASSIGN button doesn't work
Solution:
- Make sure dropdown shows a voice
- Click TEST first
- Check console for errors
```

---

## Tips

### **Fun Voice Combinations**

**Comedy Film:**
```
Character 1: Bahh (sheep voice)
Character 2: Zarvox (alien robot)
Character 3: Whisper (quiet/creepy)
```

**Serious Drama:**
```
Character 1: Samantha (clear female)
Character 2: Daniel (British male)
Character 3: Moira (Irish female)
```

**Experimental:**
```
Character 1: Cellos (musical)
Character 2: Wobble (unstable)
Character 3: Trinoids (multiple)
```

---

## Summary

**3 ways to test voices:**

1. **🎤 VOICES button** (recommended)
   - Full control panel
   - Dropdown for each entity
   - TEST and ASSIGN buttons

2. **Click speaker name in chat**
   - Opens side panel
   - Shows all voices
   - Click to assign + test

3. **Console logging**
   - See assignments in real-time
   - Debug audio issues

**Best workflow:**
1. Load film
2. Open 🎤 VOICES panel
3. Test voices for each character
4. Assign favorites
5. Close panel
6. Play film
7. Enjoy unique voices! 🎭🎤✨

---

**Now you have full control over which voice speaks which character!**
