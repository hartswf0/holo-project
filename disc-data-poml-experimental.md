# DISC-DATA POML (Experimental) - Runtime Compiler Specification

**Purpose**: Generate disc-data.json for HOLO PROJECT by understanding **what it can render**, not by copying examples.

**Philosophy**: Negative space engineering. Define the boundaries, let infinite variety emerge within constraints.

---

## Part 1: HOLO PROJECT Rendering Invariants

### Coordinate Space (HARD LIMITS)
```
Valid world coordinates:
  X: -4.5 to +4.5 (9 units total)
  Y: 0.55 (fixed ground level, no vertical stacking)
  Z: -4.5 to +4.5 (9 units total)

Grid origin: (4, 0, 4) grid coords = (0, 0, 0) world coords
Cell size: 1.0 world unit

Minimum entity spacing: 1.5 units (prevents overlap)
Maximum entities per scene: ~15 (visibility threshold)
```

### Geometry Rules (BINARY DECISION)
```javascript
IF (timeline contains entry where target_element_id === entity.id AND text !== null)
  THEN render as CONE (0.4 radius, 1.2 height) — "speaker"
  ELSE render as BOX (0.8 cube) — "prop/location/apparatus"

// The engine auto-decides based on timeline, NOT element.type
// type field is metadata only
```

### Visual Effects (AUTOMATIC, DATA-TRIGGERED)
```
Laser eyes: spawn IF entity speaks, point to nearest other entity
Info flow: 8 particle planes from speaker → target (green #56ff9f)
Speech bubble: centered in camera, 200 char limit, 5s duration
Power bars: IF power_distribution exists, spawn vertical bars above grid
Grid pulse: color based on scene title keywords (red=chaos, yellow=process, green=calm)
Ambient particles: IF intensity > 0.7, spawn 20 floating spheres
Entity glow: all entities have emissive = color * 0.22
```

### Timeline Execution (TEMPORAL CONSTRAINTS)
```
Turn timing: 5 seconds per turn (configurable via duration)
Sequence: strictly sequential by turn number (0, 1, 2...)
Speech rendering: target_element_id MUST match an element.id
Empty turns: allowed (pauses, silent beats)
Max text length: 200 characters (truncated if longer)
```

---

## Part 2: Generative Constraints (What Makes Good Data)

### Entity Design Patterns

**Pattern 1: Speaker/Observer Split**
```json
Speakers (CONES): entities with dialogue, faces camera, laser eyes
Non-speakers (BOXES): locations, apparatus, memory stores, no face

Example roles:
  - Speaker: character, narrator, oracle, guide, witness
  - Non-speaker: archive, sensor, environment, tool, MacGuffin
```

**Pattern 2: Spatial Semantics**
```
Center (0,0): protagonist, focal object, ritual site
Periphery (±4, ±4): background, archives, passive observers
Front (z < 0): approaching, threatening, presenting
Back (z > 0): retreating, supporting, observing
Left/Right: oppositional pairs, dialogue partners
```

**Pattern 3: Power Distribution Logic**
```javascript
Sum of all power scores ≈ 100 (convention, not enforced)
High power (60-80): scene driver, decision maker
Medium (30-50): supporting role, reaction
Low (5-20): passive witness, apparatus, archive
Zero/absent: not in scene or background only

Power shapes camera attention + narrative weight
```

---

## Part 3: Constraint-Based Generation Protocol

### Step 1: Extract Narrative Structure
```
Input: Any text/conversation/concept
Output: Scene beats (who speaks, when, why)

Questions to answer:
1. Who has agency? (these become speakers/cones)
2. What stores memory? (archives/filing cabinets/boxes)
3. What measures/analyzes? (apparatus/sensors/boxes)
4. What are the locations? (named boxes at periphery)
5. What's the temporal arc? (scenes = beats, turns = exchanges)
```

### Step 2: Map to Coordinate Space
```python
def position_entity(role, scene_context):
    if role == "protagonist": return (0, 0, 0)
    if role == "antagonist": return (0, 0, -3)  # front/confronting
    if role == "archive": return (-4, 0, 2)     # back corner
    if role == "apparatus": return (3, 0, -2)    # front side
    if role == "witness": return (2.5, 0, 0)     # beside center
    if role == "environment": return (0, 0, 4)   # background
    # else: distribute evenly avoiding overlap
```

### Step 3: Timeline Synthesis
```
For each scene beat:
  1. Assign turn number (sequential from 0)
  2. Identify speaker (target_element_id)
  3. Extract/generate text (200 char max, preserve voice)
  4. Optional: add emotion tag (used for voice TTS modulation)
  
Non-dialogue beats (valid):
  - Apparatus analysis: "[SCANNING... <metric>: <reading>]"
  - Filing storage: "[FILING: '<text>' → Slot <ID>]"
  - Environmental: "[<sound/visual description>]"
```

### Step 4: Power Calculation
```javascript
// Heuristic: speaking frequency + semantic centrality
power_score = (dialogue_turns / total_turns) * 100 * centrality_weight

centrality_weight:
  - Decision maker: 1.2
  - Reactor: 1.0
  - Observer: 0.8
  - Apparatus: 0.3
  - Archive: 0.2
```

---

## Part 4: Variety Through Constraint Permutation

### Scenario Templates (Structural Patterns)

**Interrogation** (Original disc-data.json)
```
Structure: 2 speakers center, 1 archive back, 1-2 apparatus sides
Power: Balanced (40/50) or asymmetric (70/30 interrogator dominant)
Turns: Alternating dialogue with apparatus interruptions
```

**Convergence** (Black Metal Scene 6)
```
Structure: N speakers in geometric formation, 1 center object, periphery apparatus
Power: Distributed evenly or one dominant + chorus
Turns: Round-robin or call-response
```

**Ritual** (NEW - sheep cyborg ethics)
```
Structure: 1 human + M non-human entities, apparatus as witness
Power: Human 60%, collective 40%
Turns: Human→entity→apparatus cycle
```

**Archive Excavation** (NEW - World Tree)
```
Structure: 1-2 researchers, N archival boxes (each a source), 1 synthesis apparatus
Power: Archives hold majority (60% distributed), researchers query (30%), synthesis (10%)
Turns: Query→retrieval→analysis loop
```

**Eusocial Network** (NEW - ant colony + parasite)
```
Structure: 1 collective entity (colony), 1 infiltrator (parasite), 1-2 observers
Power: Shifts across scenes (colony 80%→parasite 80%)
Turns: Colony emergent dialogue + parasite injection
```

### Micro-Scenes for Testing Variety

Generate 5-10 of these to prove robustness:

```json
{
  "title": "Minimal Test",
  "scenes": [
    {
      "elements": [
        {"id": "a", "position": {"x": 0, "y": 0, "z": 0}, "color": "#56ff9f"},
        {"id": "b", "position": {"x": 2, "y": 0, "z": 0}, "color": "#ff9f56"}
      ],
      "timeline": [
        {"turn": 0, "target_element_id": "a", "text": "Hello."},
        {"turn": 1, "target_element_id": "b", "text": "World."}
      ],
      "duration": 10
    }
  ]
}
```

**Variant 1**: 3 entities triangle
**Variant 2**: 1 speaker + 3 silent boxes (props)
**Variant 3**: 5 speakers pentagon formation
**Variant 4**: 1 speaker monologue (no other entities)
**Variant 5**: 2 speakers + 5 apparatus (sensor array)
**Variant 6**: 10 entities, only 2 speak (crowd scene)

---

## Part 5: Evidence-Colored Assertions (Research Integration)

### Color-Coding System
```
green: empirical (peer-reviewed, verified data)
  Example: Ophiocordyceps clock-gene disruption (PLOS study)
  
amber: contested but plausible (hypothesis, emerging science)
  Example: Virus-world hypothesis, aquatic ape fringe
  
purple: mythic/ritual (cultural, speculative, diegetic)
  Example: World Tree archives, mermpeople holobionts
  
red: known false (included for narrative critique)
  Example: Nazi zombie archive as warning signal
```

### Encoding in disc-data
```json
{
  "id": "claim_entity",
  "name": "Parasite Manipulation",
  "description": "[green] Ophiocordyceps disrupts ant circadian genes (PLOS 2011)",
  "metadata": {
    "evidence_color": "green",
    "citation": "DOI:10.1371/journal.pone.0024024"
  }
}
```

### Ritual Mechanics as Timeline Beats
```json
{
  "turn": 3,
  "target_element_id": "sheep_collar",
  "text": "[CONSENT CHECK: gait variance 4.2% → threshold 5% → fence ACTIVE]",
  "metadata": {
    "ritual_type": "consent_dashboard",
    "evidence_color": "amber",
    "citation": "German virtual fence pilots 2024 (oekolandbau.de)"
  }
}
```

---

## Part 6: Negative Space Boundaries (What NOT to Generate)

### Forbidden Patterns
```
❌ Entities at same (x, z) coordinate (will stack/overlap)
❌ Y values other than 0.55 (engine ignores, causes confusion)
❌ Dialogue without target_element_id (won't render)
❌ target_element_id not in elements array (crashes)
❌ Coordinate values outside -4.5 to +4.5 (off-grid, invisible)
❌ More than 200 characters in text (truncated, breaks layout)
❌ Duplicate element IDs (only last one renders)
❌ Timeline turns out of order (creates temporal paradoxes)
```

### Soft Limits (Degradation, Not Failure)
```
⚠️ More than 15 entities (camera can't frame all)
⚠️ More than 10 turns per scene (viewer fatigue, >50s)
⚠️ Entities closer than 1.5 units (visual crowding)
⚠️ Power distribution sum >> 100 (confusing, not enforced)
⚠️ Scenes longer than 60s (pacing drags)
⚠️ More than 8 scenes total (narrative overload)
```

---

## Part 7: Synthetic Data Generation Prompts

### Prompt 1: Minimal Viable Scene
```
Generate a 2-entity, 3-turn scene testing basic rendering:
- 1 speaker, 1 prop
- Speaker at origin, prop at (2, 0, 1)
- Dialogue: introduction → observation → question
- Duration: 15 seconds
```

### Prompt 2: Power Asymmetry
```
4 entities: 1 interrogator (power 70), 1 subject (20), 1 archive (5), 1 apparatus (5)
Subject speaks 60% of turns, interrogator 30%, apparatus 10%
Test: Does power reflect narrative weight or speaking frequency?
```

### Prompt 3: Geometric Formation
```
5 entities in pentagon (radius 3 units, center origin)
Each speaks once in clockwise order
Test: Camera follows circular gaze pattern
```

### Prompt 4: Silent Majority
```
10 entities (boxes), 2 speakers (cones)
Speakers dialogue while surrounded by apparatus/archives
Test: Boxes fade to 25% opacity during dialogue
```

### Prompt 5: Apparatus Chorus
```
1 human researcher, 6 apparatus entities arranged in line
Human asks question, each apparatus responds with sensor reading
Test: Info flow particles from human → all apparatus simultaneously
```

### Prompt 6: Multi-Scene Entity Journey
```
3 scenes, 1 entity moves from (4, 0, 4) → (0, 0, 0) → (-4, 0, -4)
Power shifts from 10% → 50% → 90% across scenes
Test: Smooth position animation + power bar growth
```

---

## Part 8: Advanced Constraint Composition

### Holobiont Relations (Networked Entities)
```json
{
  "elements": [
    {"id": "kelp", "position": {"x": 0, "y": 0, "z": 0}},
    {"id": "bacteria_1", "position": {"x": 0.5, "y": 0, "z": 0.5}},
    {"id": "bacteria_2", "position": {"x": -0.5, "y": 0, "z": 0.5}}
  ],
  "timeline": [
    {"turn": 0, "target_element_id": "kelp", "text": "I am not one."},
    {"turn": 1, "target_element_id": "bacteria_1", "text": "[Nitrogen cycle active]"},
    {"turn": 2, "target_element_id": "bacteria_2", "text": "[Carbon sequestration 3.2g/m²]"}
  ],
  "metadata": {
    "holobiont_id": "kelp_forest_01",
    "constituent_count": 3
  }
}
```

### Ritual State Machines
```json
{
  "turn": 5,
  "target_element_id": "world_tree_root",
  "text": "[CARE ACTION: watering → moisture +12% → vapor state PREVENTED]",
  "metadata": {
    "ritual_phase": "maintenance",
    "state_transition": "at_risk → stable",
    "evidence_color": "purple"
  }
}
```

### Consent Dashboard (Dynamic Thresholds)
```json
{
  "turn": 0,
  "target_element_id": "sheep_monitor",
  "text": "[Gait variance: 3.1% | Rumination: normal | Threshold: 5% → fence ALLOWED]"
},
{
  "turn": 3,
  "target_element_id": "sheep_monitor",
  "text": "[Gait variance: 6.2% ⚠️ | THRESHOLD EXCEEDED → fence DISABLED, human override]",
  "metadata": {
    "consent_check": "failed",
    "welfare_metric": "gait_variance",
    "action": "disable_fence"
  }
}
```

---

## Part 9: Compilation Checklist

Before outputting disc-data.json, verify:

### Structural Validity
- [ ] All `target_element_id` values exist in `elements` array
- [ ] No duplicate element IDs
- [ ] All positions within [-4.5, +4.5] range
- [ ] All Y values are 0 or 0.55
- [ ] Timeline turns are sequential (0, 1, 2...)

### Rendering Compatibility
- [ ] At least 1 element has speaking lines (otherwise all boxes)
- [ ] No entities at identical (x, z) coordinates
- [ ] Text fields under 200 characters
- [ ] Duration values reasonable (10-60 seconds)

### Narrative Coherence
- [ ] Power distribution sums to ~100 per scene
- [ ] Speaking frequency roughly matches power scores
- [ ] Spatial positioning reflects relationships (proximity = connection)
- [ ] Scene count manageable (3-8 scenes ideal)

### Evidence Integration (if applicable)
- [ ] Claims tagged with evidence color
- [ ] Citations included in metadata
- [ ] Contested assertions marked amber/purple
- [ ] False/warning content explicitly flagged

---

## Part 10: Output Format (Minimal Valid Schema)

```json
{
  "title": "<simulation_name>",
  "subtitle": "<optional_tagline>",
  "scenes": [
    {
      "scene_number": 1,
      "title": "<scene_title>",
      "subtitle": "<optional>",
      "duration": 30,
      "elements": [
        {
          "id": "<unique_id>",
          "name": "<display_name>",
          "type": "<character|machine|location|entity>",
          "position": {"x": 0, "y": 0, "z": 0},
          "color": "#56ff9f",
          "description": "<optional_context>"
        }
      ],
      "timeline": [
        {
          "turn": 0,
          "target_element_id": "<element_id>",
          "text": "<dialogue_or_action>",
          "emotion": "<optional>"
        }
      ],
      "power_distribution": {
        "<element_id>": 50
      },
      "scene_audio": {
        "background_music": "ambient_cosmic",
        "intensity": 0.5
      }
    }
  ]
}
```

**Required fields**: `title`, `scenes[].elements`, `scenes[].timeline`  
**Optional but recommended**: `power_distribution`, `scene_audio`, `description`, `emotion`

---

## Usage Pattern

1. **Receive any input** (text, conversation, concept, research paper)
2. **Extract narrative beats** (who acts, what happens, when)
3. **Map to constraints**:
   - Identify speakers → assign positions
   - Chunk into scenes (beats)
   - Sequence timeline turns
   - Calculate power distribution
4. **Generate JSON** following schema
5. **Validate** against checklist
6. **Output** disc-data.json

**No one-shot examples.** Learn the constraints, generate infinite variety within bounds.

---

## End of Specification

This POML teaches **what HOLO PROJECT can render**, not **what one example looks like**.  
Generate anything from ant parasites to sheep cyborgs to kelp merm people—all within the same rendering constraints.

**The medium is the constraint. The variety is yours.**
