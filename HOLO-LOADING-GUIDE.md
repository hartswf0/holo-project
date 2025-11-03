# HOLO PROJECT - Data Loading Guide

## ✅ Problem Fixed!

**Issue**: Couldn't load black-metal-disc-data.json
**Root Cause**: Parser required `global_elements_legend` field (old format only)
**Solution**: Updated parser to accept both old and new formats

---

## 🚀 How to Load Data (4 Ways)

### Method 1: Dropdown Menu (EASIEST!)
```
1. Open holo-project.html
2. Look for dropdown at top: "Select Data File..."
3. Choose one:
   - Interrogation Chamber (Original) 
   - Black Metal: Cosmic Alchemy
4. Click PLAY
5. Watch! 🎬
```

### Method 2: Load Custom Button
```
1. Click "Load Custom" button
2. Browse to your .json file
3. Select it
4. Click PLAY
```

### Method 3: Drag & Drop
```
1. Open holo-project.html
2. Drag any .json file from your file explorer
3. Drop it anywhere on the page
4. Click PLAY
```

### Method 4: Paste JSON
```
1. Copy JSON content (Ctrl/Cmd+C)
2. Click on holo-project.html page
3. Paste (Ctrl/Cmd+V)
4. Click PLAY
```

---

## 📊 What Changed

### Parser Updates
**Before:**
```javascript
// Required old format with global_elements_legend
if (data.scenes && data.global_elements_legend) return parseDiscData(data);
```

**After:**
```javascript
// Accepts any scenes array (old or new format)
if (data.scenes && Array.isArray(data.scenes)) return parseDiscData(data);
```

### New Format Support
```javascript
// NEW FORMAT (simple)
{
  "scenes": [{
    "elements": [...],      // Direct array
    "timeline": [...],      // Direct array
    "duration": 30
  }]
}

// OLD FORMAT (complex)
{
  "global_elements_legend": {...},
  "scenes": [{
    "elements_in_scene": [...],
    "animation_timeline": [...],
    "metadata": { "scene_duration_seconds": 30 }
  }]
}
```

Both work now! ✅

---

## 🎬 Testing Black Metal Data

### Quick Test:
```bash
1. Open: holo-project.html
2. Dropdown: Select "Black Metal: Cosmic Alchemy"
3. Watch chat log for: "✅ Successfully loaded..."
4. Click PLAY
5. Should see 6 scenes with:
   - Amon Focus (green cone)
   - Ari Melenciano (orange cone)
   - Jordan, Jeremy, Kordae (various cones)
   - Filing Cabinet (blue box) - stores/retrieves dialogue
   - Apparatus units (red boxes) - analyze data
```

### What You Should See:
- **Scene 1**: "First Contact" - Email arrival
- **Scene 2**: "Celestial Florilegia" - Floramancy explained
- **Scene 3**: "Training Grounds" - Self-transformation
- **Scene 4**: "Companion 180" - Spacesuit tech
- **Scene 5**: "Dark Voyage" - Inner space
- **Scene 6**: "Cosmic Alchemy" - All creators converge

### Visual Checks:
✅ Cones (triangles) = Speaking characters
✅ Boxes (cubes) = Filing cabinets & apparatus
✅ Laser eyes shoot from speakers
✅ Green particles flow between entities
✅ Filing cabinet glows when storing/retrieving
✅ Apparatus displays analysis text
✅ Power bars show influence distribution

---

## 🐛 Troubleshooting

### "Error loading preset"
- **Check**: Is file in same directory as holo-project.html?
- **Check**: Open browser console (F12) for detailed error
- **Fix**: Make sure black-metal-disc-data.json exists

### "Loaded 0 scenes"
- **Check**: JSON syntax valid? (use JSONLint.com)
- **Check**: Has `scenes` array at top level?
- **Fix**: Verify file structure matches examples

### Entities not appearing
- **Check**: Do elements have `position` field?
- **Check**: Are positions reasonable? (-5 to +5 range)
- **Fix**: Add missing position: `{x: 0, y: 0, z: 0}`

### No dialogue playing
- **Check**: Does timeline have `target_element_id` fields?
- **Check**: Do IDs match element IDs exactly?
- **Fix**: Verify ID spelling matches between elements & timeline

---

## 📝 Data Format Checklist

### Minimum Required Fields:
```json
{
  "title": "Your Simulation",
  "scenes": [
    {
      "scene_number": 1,
      "title": "Opening",
      "subtitle": "The Beginning",
      "duration": 30,
      "elements": [
        {
          "id": "character_a",
          "name": "Character A",
          "type": "character",
          "position": { "x": 0, "y": 0, "z": 0 },
          "color": "#56ff9f",
          "description": "The protagonist"
        }
      ],
      "timeline": [
        {
          "turn": 0,
          "target_element_id": "character_a",
          "text": "Hello world!",
          "emotion": "neutral"
        }
      ],
      "power_distribution": {
        "character_a": 100
      },
      "scene_audio": {
        "background_music": "ambient_drone",
        "intensity": 0.5
      }
    }
  ]
}
```

### Optional but Recommended:
- `subtitle` - Shows under scene title
- `emotion` - Adds flavor to dialogue
- `description` - Shows in entity info cards
- `power_distribution` - Shows influence bars
- `scene_audio` - Enhances atmosphere

---

## 🎯 Success Criteria

You'll know it's working when:

✅ **Dropdown loads file** - Chat shows "✅ Successfully loaded..."
✅ **Scenes appear** - Chat shows "Loaded X scenes"
✅ **Entities spawn** - See cones and boxes on stage
✅ **Title card shows** - Big scene title appears
✅ **PLAY works** - Dialogue advances automatically
✅ **Visual effects** - Laser eyes, particles, glows
✅ **Filing cabinet active** - Shows [FILING...] and [RETRIEVING...]
✅ **Apparatus active** - Shows [ANALYZING...] messages

---

## 📚 Related Files

- `holo-project.html` - The viewer (UPDATED)
- `disc-data.json` - Original interrogation data (10 scenes)
- `black-metal-disc-data.json` - Afrofuturist data (6 scenes)
- `disc-data-poml.md` - Generator prompt for making new data
- `holo-index.html` - Tutorial & philosophy guide

---

## 🚀 Next Steps

1. **Test the dropdown** - Select "Black Metal: Cosmic Alchemy"
2. **Verify loading** - Check chat for success message
3. **Click PLAY** - Watch Scene 1 start
4. **Observe effects** - Filing cabinet storing, apparatus analyzing
5. **Navigate scenes** - Use PREV/NEXT buttons
6. **Try camera modes** - Click camera rail buttons

If all 6 steps work, the system is fully functional! 🎉

---

## 💡 Pro Tips

- **Press HELP button** for in-app guide
- **Click entity cards** to follow characters
- **Enable TTS** for voice narration
- **Use CINEMATIC** for full-screen mode
- **Try MULTI-CAM** for 4-view split screen
- **Check power bars** to see who controls scene

---

**Status**: ✅ FIXED & READY TO USE

The loading system now supports:
- Old complex format (disc-data.json)
- New simple format (black-metal-disc-data.json)
- Easy dropdown selection
- Multiple loading methods
- Clear error messages
- Success feedback

**Load, play, and enjoy!** 🎬✨
