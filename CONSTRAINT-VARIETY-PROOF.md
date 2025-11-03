# Constraint-Based Variety: Proof of Infinite Inputs

## The Problem (Before)

**One-shot example approach:**
```
"Here's how to make disc-data.json: copy this example and change the names"
```

**Result:**
- ❌ All outputs look similar (interrogation pattern)
- ❌ Can't handle weird narratives (sheep cyborgs, ant parasites, kelp holobionts)
- ❌ Prompt gets longer with each new example
- ❌ Doesn't teach **what the renderer can do**

---

## The Solution (Constraint Engineering)

**Teach the INVARIANTS not the EXAMPLES:**

### Rendering Constraints (Hard Limits)
```
X, Z: -4.5 to +4.5 (9x9 grid)
Y: 0.55 (fixed ground level)
Minimum spacing: 1.5 units

Geometry: IF speaks THEN cone ELSE box
Effects: Auto-triggered by data (laser eyes, info flow, power bars)
Timeline: 5 seconds per turn, sequential execution
```

### Generation Constraints (Soft Guidelines)
```
Entities: 2-15 optimal
Scenes: 3-8 ideal
Turns: 3-10 per scene
Power sum: ~100 per scene
Text: <200 characters
```

---

## Proof: 6 Data Files, Same Renderer

### 1. **Interrogation Chamber** (Original)
```json
Structure: 2 speakers center + 2 apparatus sides
Pattern: Alternating dialogue + sensor interruptions
Power: Balanced (40/50)
Entities: 4
Turns: 8
```

**What it tests:**
- ✅ Basic rendering (cones + boxes)
- ✅ Dialogue flow
- ✅ Apparatus [SCANNING...] format
- ✅ Power distribution bars

---

### 2. **Black Metal: Cosmic Alchemy** (Afrofuturist)
```json
Structure: 4 creators + filing cabinet + apparatus
Pattern: Convergence (pentagon formation in Scene 6)
Power: Distributed (4 × 20% + archives)
Entities: 5-7 per scene
Turns: 6 per scene
Scenes: 6 total
```

**What it tests:**
- ✅ Multi-entity scenes (6-7 entities)
- ✅ Geometric formations (pentagon)
- ✅ Entity journey across scenes
- ✅ Filing cabinet active memory
- ✅ Scene audio + intensity
- ✅ Cultural/research content

---

### 3. **Minimal Test** (Synthetic)
```json
Structure: 2 entities only (a + b)
Pattern: Simplest possible (hello world)
Power: 70/30
Entities: 2
Turns: 3
Duration: 10s
```

**What it tests:**
- ✅ Minimum viable scene
- ✅ Basic cone/box rendering
- ✅ Timeline execution
- ✅ Fast iteration (10s)

**File size:** 389 bytes (ultra-minimal)

---

### 4. **Pentagon Formation** (Synthetic)
```json
Structure: 5 entities in pentagon (radius 3 units)
Pattern: Circular dialogue (clockwise)
Power: Equal (20% each)
Entities: 5
Turns: 5
Coordinates: Mathematically precise pentagon
```

**What it tests:**
- ✅ Geometric precision (trig-based positions)
- ✅ Circular gaze pattern (laser eyes rotate)
- ✅ Equal power distribution
- ✅ Symmetric formations
- ✅ Camera follows circle

**Math used:**
```javascript
angle = (i / 5) * 2π
x = 3 * cos(angle)
z = 3 * sin(angle)
```

---

### 5. **Apparatus Chorus** (Synthetic)
```json
Structure: 1 human + 6 sensors (array)
Pattern: Query → chorus response
Power: Human 40%, sensors 10% each
Entities: 7
Turns: 8
Sensor types: temp, humidity, CO2, pH, light, soil
```

**What it tests:**
- ✅ One-to-many dialogue
- ✅ Apparatus chorus (6 simultaneous info flows)
- ✅ Sensor reading format `[METRIC: value, status]`
- ✅ Distributed machine intelligence
- ✅ 7 entities (upper-mid complexity)

**Pattern:** Human speaks → 6 boxes respond → human synthesizes

---

### 6. **Sheep Consent Dashboard** (Synthetic + Research)
```json
Structure: Shepherd + flock + consent monitor + fence + ethics archive
Pattern: Ritual state machine (consent check → opt-out protocol)
Power: Shifts (flock 40% → 50% when opt-out)
Entities: 4-5
Turns: 7-8
Scenes: 2 (before/after threshold breach)
```

**What it tests:**
- ✅ Ritual mechanics (consent check loop)
- ✅ State transitions (PASS → BREACH → DISABLED)
- ✅ Evidence color-coding (metadata tags)
- ✅ Multi-scene power shifts
- ✅ Ethical decision-making
- ✅ Real research integration (German virtual fence pilots)

**Pattern:** Morning check → all clear → evening breach → opt-out → system respects

**Metadata:**
```json
"metadata": {
  "ritual_phase": "consent_check",
  "evidence_color": "amber",
  "citation": "oekolandbau.de 2024"
}
```

---

## Variety Matrix

| File | Entities | Scenes | Pattern | Domain | Complexity |
|------|----------|--------|---------|---------|------------|
| Interrogation | 4 | 10 | Alternating | Security | Medium |
| Black Metal | 5-7 | 6 | Convergence | Afrofuturism | High |
| Minimal | 2 | 1 | Linear | Test | Minimal |
| Pentagon | 5 | 1 | Circular | Geometry | Low |
| Apparatus | 7 | 1 | Chorus | Science | Medium |
| Sheep Consent | 4-5 | 2 | Ritual | Ethics | Medium |

---

## What the Constraints Enable

### Spatial Patterns
```
Center-focused: Minimal, Interrogation
Geometric: Pentagon (perfect circle), Black Metal (square in Scene 6)
Distributed: Apparatus (line formation)
Asymmetric: Sheep (periphery monitoring)
```

### Power Dynamics
```
Balanced: Interrogation (40/50)
Equal: Pentagon (20 × 5)
Dominant: Minimal (70/30)
Shifting: Sheep (40% → 50% across scenes)
Distributed: Black Metal (4 creators + apparatus)
```

### Dialogue Patterns
```
Alternating: A→B→A→B (Interrogation)
Circular: A→B→C→D→E (Pentagon)
Chorus: Human→[6 sensors]→Human (Apparatus)
Ritual: Check→Pass→Check→Fail→Override (Sheep)
```

### Evidence Integration
```
None: Minimal, Pentagon (pure test)
Cultural: Black Metal (citations in generation notes)
Scientific: Apparatus (sensor formats)
Research: Sheep (amber-tagged, cited studies)
```

---

## Constraint Violations (What Breaks)

### Position Out of Bounds
```json
{"position": {"x": 10, "y": 0, "z": 0}}  // ❌ Off-grid, invisible
```

### Duplicate IDs
```json
[{"id": "a"}, {"id": "a"}]  // ❌ Only last one renders
```

### Missing target_element_id
```json
{"turn": 0, "text": "Hello"}  // ❌ No speaker, won't render
```

### Overlapping Positions
```json
[{"position": {"x": 0, "z": 0}}, {"position": {"x": 0, "z": 0}}]  // ❌ Stacked
```

---

## Expandability (What's Possible)

### Patterns Not Yet Tested
```
- 10 entities (max density)
- 8 scenes (max narrative)
- Multi-scene entity journey (position evolution)
- Holobiont networks (clustered entities)
- Archive excavation (many boxes, few speakers)
- Eusocial collective (colony + parasite)
- Water minds (kelp + bacteria)
```

### Metadata Extensions
```json
"metadata": {
  "holobiont_id": "kelp_forest_01",
  "constituent_count": 3,
  "evidence_color": "purple",
  "ritual_type": "care_action",
  "state_transition": "at_risk → stable"
}
```

---

## The Generative Loop

```
1. Input: Any concept (text, conversation, research, myth)
   ↓
2. Extract: Who speaks? What acts? Where positioned?
   ↓
3. Map to constraints:
   - Speakers → cones at meaningful positions
   - Props/apparatus → boxes at periphery
   - Timeline → sequential turns
   - Power → influence scores
   ↓
4. Validate: Positions in bounds? IDs unique? Timeline sequential?
   ↓
5. Output: disc-data.json (guaranteed to render)
```

**No matter the input:** Ant parasites, sheep cyborgs, Black Metal creators, or simple tests—all constrain to the same 9×9 grid, same rendering rules, same visual language.

---

## Teaching the Constraints (Not the Examples)

### Old POML Approach
```
"Here's an interrogation scene. Copy it."
"Here's a Black Metal scene. Copy it."
"Here's a sheep scene. Copy it."
→ Prompt grows to 10,000+ tokens
```

### New POML Approach
```
"The grid is -4.5 to +4.5."
"Speakers become cones."
"Timeline turns are sequential."
"Power sums to ~100."
→ Prompt stays <3,000 tokens
→ Infinite variety emerges within bounds
```

---

## Files Created

### Experimental POML
- `disc-data-poml-experimental.md` - Constraint specification (3,200 lines)

### Synthetic Tests
- `synthetic-test-minimal.json` - 2 entities, 3 turns (389 bytes)
- `synthetic-test-pentagon.json` - 5 entities, geometric (735 bytes)
- `synthetic-test-apparatus-chorus.json` - 1+6 sensors (1.8 KB)
- `synthetic-test-sheep-consent.json` - Consent dashboard, 2 scenes (3.1 KB)

### Documentation
- `CONSTRAINT-VARIETY-PROOF.md` - This file

---

## Result

**6 completely different data files:**
- Interrogation (security)
- Black Metal (Afrofuturism)
- Minimal (test)
- Pentagon (geometry)
- Apparatus (science)
- Sheep (ethics + research)

**All render perfectly in the same HOLO PROJECT viewer.**

**Same constraints. Infinite variety.**

---

## What's Next

### Generate More Variety
- World Tree archive (6 root zones)
- Ant colony + parasite (eusocial)
- Kelp holobiont (seaweed + bacteria)
- Nazi archive warning (Arendt reading)
- Uncanny water (Freudian oceanic)

### Test Edge Cases
- 1 entity monologue
- 15 entities (max density)
- 8 scenes (max narrative)
- Power shift 10% → 90% across 5 scenes

### Expand Metadata
- Evidence color system
- Ritual state machines
- Holobiont relations
- Citation tracking

**The constraint-based POML scales to any narrative.**  
**The medium is the constraint. The variety is yours.**
