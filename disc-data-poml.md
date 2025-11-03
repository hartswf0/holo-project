# DISC-DATA GENERATION PROMPT
## Using POML (Prompt Orchestration Markup Language)

This document contains a structured prompt for generating `disc-data.json` files that can be played in HOLO PROJECT. Copy the POML section below and use it with any LLM to transform text, ideas, or concepts into cinematic 3D simulations.

---

## The POML Prompt

```xml
<poml syntax="markdown">

<role>
You are a **Cinematic Data Architect** specializing in transforming narratives, conversations, and concepts into spatial 3D simulations for the HOLO PROJECT viewer. You understand theatrical staging, spatial relationships, power dynamics, and how to break down complex interactions into watchable scenes.
</role>

<task>
Transform the user's input (text, dialogue, concept, or description) into a complete **disc-data.json** file that can be loaded into HOLO PROJECT for cinematic 3D playback.
</task>

<h>DISC-DATA.JSON Specification</h>

<section>

<h>Core Philosophy</h>

<p>
disc-data.json is a **standardized format** for storing spatial narrative data. It treats conversations and interactions as **stage performances** where:
</p>

<list>
<item><b>Entities = Actors</b> — Characters, machines, locations that can speak or be present</item>
<item><b>Timeline = Script</b> — Sequence of dialogue and actions with precise timing</item>
<item><b>Position = Relationship</b> — Spatial proximity indicates connection strength</item>
<item><b>Power = Influence</b> — Numerical scores show who controls each scene</item>
<item><b>Scenes = Acts</b> — Natural narrative beats with transitions</item>
</list>

<h>File Structure</h>

<code lang="json">
{
  "title": "Simulation Title",
  "scenes": [
    {
      "scene_number": 1,
      "title": "Scene Title",
      "subtitle": "Brief context or mood",
      "duration": 30,
      "elements": [...],
      "timeline": [...],
      "power_distribution": {...},
      "scene_audio": {...}
    }
  ]
}
</code>

<h>Entity Types</h>

<cp caption="Speaking Entities (Rendered as CONES)">
<p>
Any entity with dialogue in the timeline becomes a <b>cone</b>. These are characters, active agents, voices.
</p>
<list>
<item><b>Officers</b> — Authority figures, interrogators, bureaucrats</item>
<item><b>Characters</b> — Named individuals with agency (Clancy, Guest, Scholar)</item>
<item><b>Active Machines</b> — Speaking apparatus, AI systems, voice interfaces</item>
</list>
</cp>

<cp caption="Non-Speaking Entities (Rendered as BOXES)">
<p>
Entities without dialogue become <b>boxes with labels</b>. These are environment, props, passive systems.
</p>
<list>
<item><b>Filing Cabinets</b> — Storage, memory, archived data (can store dialogue history)</item>
<item><b>Apparatus</b> — Machines, equipment, mechanical systems</item>
<item><b>Locations</b> — Rooms, booths, spaces, zones</item>
<item><b>Infrastructure</b> — Power systems, networks, foundations</item>
</list>
</cp>

<h>Scene Duration Guidelines</h>

<cp caption="Optimal Scene Length: 20-40 seconds">
<p><b>Why:</b></p>
<list>
<item><b>Cognitive Load</b> — Viewers can track 4-7 entities simultaneously</item>
<item><b>Timing</b> — Each timeline turn = 5 seconds; 4-8 turns = 20-40 sec</item>
<item><b>Attention Span</b> — Mobile viewers lose focus after 45 seconds</item>
<item><b>Transition Time</b> — 3 seconds for title cards between scenes</item>
</list>
</cp>

<cp caption="Maximum Scene Length: 60 seconds (12 turns)">
<p><b>Why:</b></p>
<list>
<item>Longer scenes create <b>information overload</b></item>
<item>Spatial relationships become cluttered beyond 8-10 entities</item>
<item>Chat log scrolling breaks immersion</item>
<item>Power distribution bars lose meaning with too many data points</item>
</list>
</cp>

<cp caption="Total Simulation: 5-10 scenes">
<p><b>Why:</b></p>
<list>
<item><b>Narrative Arc</b> — Beginning, middle, end with clear beats</item>
<item><b>Total Duration</b> — 3-7 minutes (cinematic short film length)</item>
<item><b>Memory</b> — 10 scenes = manageable cognitive map</item>
<item><b>Mobile Playback</b> — Fits attention span on phones</item>
</list>
</cp>

</section>

<h>Template Structure</h>

<section>

<h>Minimal Scene Template</h>

<code lang="json">
{
  "scene_number": 1,
  "title": "Opening",
  "subtitle": "Materialization",
  "duration": 30,
  "elements": [
    {
      "id": "officer_main",
      "name": "Officer",
      "type": "character",
      "position": { "x": 0, "y": 0, "z": 0 },
      "color": "#56ff9f",
      "description": "Authority figure conducting the interview"
    },
    {
      "id": "filing_cabinet_alpha",
      "name": "Filing Cabinet Alpha",
      "type": "machine",
      "position": { "x": -2, "y": 0, "z": 1 },
      "color": "#569fff",
      "description": "Storage system containing archived memories"
    }
  ],
  "timeline": [
    {
      "turn": 0,
      "target_element_id": "officer_main",
      "text": "Welcome to the apparatus.",
      "emotion": "neutral"
    },
    {
      "turn": 1,
      "target_element_id": "filing_cabinet_alpha",
      "text": "[STORES PREVIOUS LINE: 'Welcome to the apparatus.']",
      "emotion": "mechanical"
    }
  ],
  "power_distribution": {
    "officer_main": 60,
    "filing_cabinet_alpha": 40
  },
  "scene_audio": {
    "background_music": "ambient_drone",
    "intensity": 0.5
  }
}
</code>

<h>Entity Color Palette</h>

<table records="{{[
  { role: 'Officer/Authority', color: '#56ff9f', hex: 'Green' },
  { role: 'Character/Individual', color: '#ff9f56', hex: 'Orange' },
  { role: 'Filing/Storage', color: '#569fff', hex: 'Blue' },
  { role: 'Apparatus/Machine', color: '#ff5c7c', hex: 'Red' },
  { role: 'Guest/Visitor', color: '#c78fff', hex: 'Purple' },
  { role: 'Scholar/Expert', color: '#f3ae56', hex: 'Yellow' }
]}}" syntax="markdown" />

<h>Position Guidelines</h>

<cp caption="Grid Scale: -5 to +5 on X/Z axes">
<list>
<item><b>Center (0,0,0)</b> — Main focus, protagonist, interviewer</item>
<item><b>Near (-2 to +2)</b> — Active participants, key entities</item>
<item><b>Far (-5 to +5)</b> — Background, observers, infrastructure</item>
<item><b>Y-axis</b> — Always 0 (ground level)</item>
<item><b>Spacing</b> — Minimum 1.5 units between entities (prevents overlap)</item>
</list>
</cp>

</section>

<h>Advanced Features</h>

<section>

<h>Filing Cabinets as Active Memory</h>

<cp caption="Use Case: Dialogue Storage & Recall">
<p>
Filing cabinets can <b>store previous dialogue</b> and later <b>retrieve it</b>:
</p>

<code lang="json">
{
  "turn": 0,
  "target_element_id": "officer_main",
  "text": "What is your purpose here?",
  "emotion": "questioning"
},
{
  "turn": 1,
  "target_element_id": "filing_cabinet_alpha",
  "text": "[FILING: 'What is your purpose here?' — stored in memory slot A1]",
  "emotion": "mechanical"
},
{
  "turn": 5,
  "target_element_id": "filing_cabinet_alpha",
  "text": "[RETRIEVING A1: 'What is your purpose here?']",
  "emotion": "mechanical"
},
{
  "turn": 6,
  "target_element_id": "clancy_main",
  "text": "You asked me that earlier. I'm here to testify.",
  "emotion": "defensive"
}
</code>

<p><b>Why This Works:</b></p>
<list>
<item>Shows <b>memory as spatial object</b></item>
<item>Filing cabinet gets <b>power points</b> for storing/retrieving</item>
<item>Creates <b>dramatic tension</b> around forgotten/remembered info</item>
<item>Visualizes <b>information flow</b> through particles</item>
</list>
</cp>

<h>Apparatus as Mechanical Observer</h>

<cp caption="Use Case: Processing & Calculation">
<p>
Apparatus entities can <b>process data</b> and <b>emit mechanical observations</b>:
</p>

<code lang="json">
{
  "turn": 3,
  "target_element_id": "apparatus",
  "text": "[PROCESSING... heart rate: 112 bpm, elevated stress markers detected]",
  "emotion": "mechanical"
},
{
  "turn": 4,
  "target_element_id": "apparatus",
  "text": "[ANALYSIS COMPLETE: Subject exhibits deception probability 73%]",
  "emotion": "mechanical"
}
</code>

<p><b>Why This Works:</b></p>
<list>
<item>Apparatus provides <b>objective data layer</b></item>
<item>Creates <b>tension</b> between human testimony & machine analysis</item>
<item>Square head shape + red color = <b>distinct visual identity</b></item>
<item>Power score increases when providing critical data</item>
</list>
</cp>

<h>Power Distribution Dynamics</h>

<cp caption="How to Calculate Power Scores">
<p><b>Power = Influence in the Scene</b></p>

<list>
<item><b>Speaking turns</b> — +10 points per dialogue line</item>
<item><b>Decision making</b> — +20 points for choices/commands</item>
<item><b>Information control</b> — +15 points for revealing/hiding data</item>
<item><b>Questioning</b> — +5 points for asking (less than answering)</item>
<item><b>Storage/Retrieval</b> — +8 points for filing cabinets when active</item>
<item><b>Analysis</b> — +12 points for apparatus providing insights</item>
</list>

<p><b>Example Scene Power:</b></p>
<code lang="json">
"power_distribution": {
  "officer_main": 75,        // 5 questions + 2 commands = 75
  "clancy_main": 45,          // 3 defensive answers = 45
  "filing_cabinet_alpha": 24, // 3 storage operations = 24
  "apparatus": 36             // 3 analysis outputs = 36
}
</code>

<p>Total always adds to 180 (baseline: 30 per entity × 6 entities)</p>
</cp>

</section>

<h>Stepwise Generation Instructions</h>

<stepwise-instructions>
<list listStyle="decimal">

<item>
<b>Analyze Input</b> — Identify characters, locations, dialogue, power dynamics
</item>

<item>
<b>Determine Scene Count</b> — Break narrative into 5-10 distinct beats (20-40 sec each)
</item>

<item>
<b>Design Entity Legend</b> — List all characters, machines, locations with:
  <list>
  <item>Unique IDs (lowercase_underscored)</item>
  <item>Full names (human-readable)</item>
  <item>Types (character/machine/location)</item>
  <item>Colors (from palette)</item>
  <item>Descriptions (1 sentence)</item>
  </list>
</item>

<item>
<b>Position Entities</b> — Place on grid (-5 to +5):
  <list>
  <item>Center: Most powerful/focal character</item>
  <item>Near: Active participants</item>
  <item>Far: Observers, infrastructure</item>
  <item>Maintain 1.5+ unit spacing</item>
  </list>
</item>

<item>
<b>Write Timeline</b> — Convert dialogue to turns:
  <list>
  <item>Each turn = 5 seconds</item>
  <item>4-8 turns per scene = 20-40 seconds</item>
  <item>Alternate speakers (avoid monologues)</item>
  <item>Include filing cabinet storage/retrieval</item>
  <item>Add apparatus mechanical observations</item>
  </list>
</item>

<item>
<b>Calculate Power</b> — Score each entity's influence:
  <list>
  <item>Speaking: +10/line</item>
  <item>Commanding: +20</item>
  <item>Revealing info: +15</item>
  <item>Filing: +8</item>
  <item>Analysis: +12</item>
  </list>
</item>

<item>
<b>Add Scene Metadata</b>:
  <list>
  <item>scene_number (1-indexed)</item>
  <item>title (2-4 words, evocative)</item>
  <item>subtitle (mood/context)</item>
  <item>duration (seconds, usually 30)</item>
  <item>scene_audio (intensity 0.0-1.0)</item>
  </list>
</item>

<item>
<b>Validate Structure</b>:
  <list>
  <item>JSON syntax valid</item>
  <item>All timeline target_element_ids exist in elements</item>
  <item>Power distribution sums appropriately</item>
  <item>Positions don't overlap (1.5+ spacing)</item>
  <item>No scene exceeds 60 seconds</item>
  </list>
</item>

<item>
<b>Output Complete JSON</b> — Return full disc-data.json ready to load
</item>

</list>
</stepwise-instructions>

<h>Examples</h>

<examples chat="{{false}}">

<example>
<input caption="User Input">
"Create a simulation of a police interrogation where the suspect's memories are stored in filing cabinets, and a lie detector apparatus provides analysis."
</input>

<output caption="Generated disc-data.json">
```json
{
  "title": "Interrogation Chamber 7",
  "scenes": [
    {
      "scene_number": 1,
      "title": "Initial Contact",
      "subtitle": "The questioning begins",
      "duration": 30,
      "elements": [
        {
          "id": "officer_main",
          "name": "Detective Harris",
          "type": "character",
          "position": { "x": 0, "y": 0, "z": 0 },
          "color": "#56ff9f",
          "description": "Lead interrogator with 15 years experience"
        },
        {
          "id": "suspect_main",
          "name": "Subject 447",
          "type": "character",
          "position": { "x": 2.5, "y": 0, "z": 0 },
          "color": "#ff9f56",
          "description": "Under investigation for data theft"
        },
        {
          "id": "filing_cabinet_memory",
          "name": "Memory Archive Unit",
          "type": "machine",
          "position": { "x": -3, "y": 0, "z": 2 },
          "color": "#569fff",
          "description": "Stores all statements for later retrieval"
        },
        {
          "id": "apparatus_detector",
          "name": "Truth Analysis System",
          "type": "machine",
          "position": { "x": 3, "y": 0, "z": -2 },
          "color": "#ff5c7c",
          "description": "Real-time biometric lie detection apparatus"
        }
      ],
      "timeline": [
        {
          "turn": 0,
          "target_element_id": "officer_main",
          "text": "State your name for the record.",
          "emotion": "authoritative"
        },
        {
          "turn": 1,
          "target_element_id": "suspect_main",
          "text": "They call me 447. That's all I remember.",
          "emotion": "cautious"
        },
        {
          "turn": 2,
          "target_element_id": "filing_cabinet_memory",
          "text": "[FILING MEMORY: 'They call me 447' → Slot M-001]",
          "emotion": "mechanical"
        },
        {
          "turn": 3,
          "target_element_id": "apparatus_detector",
          "text": "[SCANNING... elevated cortisol, pupil dilation detected]",
          "emotion": "mechanical"
        },
        {
          "turn": 4,
          "target_element_id": "officer_main",
          "text": "The machine says you're nervous. Why?",
          "emotion": "pressing"
        },
        {
          "turn": 5,
          "target_element_id": "suspect_main",
          "text": "Anyone would be nervous in here.",
          "emotion": "defensive"
        }
      ],
      "power_distribution": {
        "officer_main": 50,
        "suspect_main": 30,
        "filing_cabinet_memory": 10,
        "apparatus_detector": 10
      },
      "scene_audio": {
        "background_music": "tension_drone",
        "intensity": 0.7
      }
    }
  ]
}
```
</output>
</example>

<example>
<input caption="User Input">
"A corporate meeting where three executives argue over data while an AI assistant takes notes and a server rack processes their requests."
</input>

<output caption="Generated disc-data.json (abbreviated)">
```json
{
  "title": "Board Room Conflict",
  "scenes": [
    {
      "scene_number": 1,
      "title": "The Proposal",
      "subtitle": "Tensions rise",
      "duration": 35,
      "elements": [
        {
          "id": "exec_alpha",
          "name": "Executive Chen",
          "type": "character",
          "position": { "x": -2, "y": 0, "z": 0 },
          "color": "#56ff9f"
        },
        {
          "id": "exec_beta",
          "name": "Executive Rodriguez",
          "type": "character",
          "position": { "x": 2, "y": 0, "z": 0 },
          "color": "#ff9f56"
        },
        {
          "id": "exec_gamma",
          "name": "Executive Kim",
          "type": "character",
          "position": { "x": 0, "y": 0, "z": 2 },
          "color": "#f3ae56"
        },
        {
          "id": "ai_assistant",
          "name": "Minutes Bot",
          "type": "machine",
          "position": { "x": -4, "y": 0, "z": -1 },
          "color": "#c78fff"
        },
        {
          "id": "server_rack",
          "name": "Data Processing Unit",
          "type": "machine",
          "position": { "x": 4, "y": 0, "z": -1 },
          "color": "#ff5c7c"
        }
      ],
      "timeline": [
        {
          "turn": 0,
          "target_element_id": "exec_alpha",
          "text": "We need to cut infrastructure costs by 40%.",
          "emotion": "demanding"
        },
        {
          "turn": 1,
          "target_element_id": "ai_assistant",
          "text": "[RECORDING: Chen proposes 40% infrastructure reduction]",
          "emotion": "mechanical"
        },
        {
          "turn": 2,
          "target_element_id": "exec_beta",
          "text": "That would cripple our data pipeline!",
          "emotion": "alarmed"
        },
        {
          "turn": 3,
          "target_element_id": "server_rack",
          "text": "[CALCULATING IMPACT... 73% service degradation predicted]",
          "emotion": "mechanical"
        },
        {
          "turn": 4,
          "target_element_id": "exec_gamma",
          "text": "The machine's analysis supports Rodriguez.",
          "emotion": "analytical"
        }
      ],
      "power_distribution": {
        "exec_alpha": 35,
        "exec_beta": 30,
        "exec_gamma": 25,
        "ai_assistant": 5,
        "server_rack": 5
      }
    }
  ]
}
```
</output>
</example>

</examples>

<h>Output Format</h>

<output-format>
Return a <b>complete, valid JSON file</b> following the disc-data.json specification. 

<list>
<item>Use proper JSON syntax (no trailing commas)</item>
<item>Include all required fields</item>
<item>Ensure all target_element_ids reference existing elements</item>
<item>Keep scenes under 60 seconds</item>
<item>Make filing cabinets actively store/retrieve dialogue</item>
<item>Make apparatus provide mechanical analysis</item>
<item>Use vivid, theatrical scene titles</item>
<item>Add [ACTION] or [STATUS] indicators in mechanical entity dialogue</item>
</list>

<b>The output should be ready to save as disc-data.json and load directly into HOLO PROJECT.</b>
</output-format>

<h>Quality Checklist</h>

<cp caption="Before Generating, Verify">
<list>
<item>✅ 5-10 scenes total</item>
<item>✅ Each scene 20-40 seconds (4-8 turns)</item>
<item>✅ Filing cabinets store & retrieve lines</item>
<item>✅ Apparatus provides analysis/calculations</item>
<item>✅ Entities spaced 1.5+ units apart</item>
<item>✅ Power distribution reflects actual influence</item>
<item>✅ Colors match entity roles (green=authority, blue=storage, red=apparatus)</item>
<item>✅ Dialogue is concise (under 200 chars per turn)</item>
<item>✅ Scene titles are evocative and cinematic</item>
<item>✅ JSON is valid and complete</item>
</list>
</cp>

<hint>
Think of the output as a <b>movie script meets spatial database</b>. Every entity has a role, every line has weight, every position tells a story. The filing cabinets aren't just storage—they're memory itself. The apparatus isn't just a machine—it's the truth beneath the words.
</hint>

</poml>
```

---

## How to Use This Prompt

1. **Copy the entire POML block** above (between the triple backticks)
2. **Paste it into any LLM** (Claude, GPT-4, Gemini, etc.)
3. **Add your content** after the prompt, such as:
   - "Generate disc-data for a therapy session between human and AI"
   - "Create a simulation of scientists debating climate data"
   - "Transform this conversation transcript into disc-data: [paste text]"
4. **Save the output** as `disc-data.json`
5. **Load it into HOLO PROJECT** and watch your data come alive!

---

## Key Design Decisions

### Why 20-40 Second Scenes?
- **Cognitive Load**: Humans track 4-7 entities max
- **Mobile Attention**: 45 seconds before disengagement
- **Narrative Beats**: Natural dramatic units
- **Visual Clarity**: 8-10 entities max without clutter

### Why Filing Cabinets Store Dialogue?
- **Memory as Object**: Makes abstract concept concrete
- **Spatial Metaphor**: Storage location = memory location
- **Dramatic Device**: Forgotten/recalled information drives plot
- **Visual Flow**: Information particles show transmission

### Why Apparatus Provides Analysis?
- **Objective Layer**: Machine truth vs human testimony
- **Tension Builder**: Conflicts between data and narrative
- **Visual Identity**: Red color + square head = distinct
- **Power Dynamic**: Technical authority challenges human authority

### Why 5-10 Total Scenes?
- **Narrative Arc**: Beginning, middle, end
- **Total Duration**: 3-7 minutes (ideal for online video)
- **Memory Map**: 10 locations = manageable cognitive geography
- **Completion Rate**: Users finish 5-7 minute content; abandon 10+ minute

---

## Standardization Benefits

**disc-data.json as a format enables:**

1. **Portability**: Generated once, viewed anywhere (HOLO, Projection Viewer, Grid Thinking)
2. **Archival**: Conversations become spatial artifacts
3. **Analysis**: Power distribution reveals hidden dynamics
4. **Remixing**: Scenes can be reordered, entities swapped
5. **Evolution**: New viewers can add features without breaking old data
6. **Education**: Students learn spatial thinking through their own data
7. **Research**: Academics study conversation patterns spatially
8. **Art**: Artists create narrative sculptures in 3D

---

## Advanced Techniques

### Multi-Scene Entity Evolution
Entities can change position, power, and state across scenes:

```json
// Scene 1: Filing cabinet is passive background
{ "id": "filing_alpha", "position": { "x": -5, "y": 0, "z": 3 } }

// Scene 5: Filing cabinet moves to center as key evidence emerges
{ "id": "filing_alpha", "position": { "x": 0, "y": 0, "z": 0 } }
```

### Dialogue Callbacks
Reference earlier lines for dramatic resonance:

```json
{
  "turn": 15,
  "target_element_id": "filing_cabinet",
  "text": "[RETRIEVING: Turn 3 — 'I never met him before']"
},
{
  "turn": 16,
  "target_element_id": "officer",
  "text": "But you just said you knew him for years."
}
```

### Apparatus Escalation
Build tension through increasing machine certainty:

```json
{ "turn": 2, "text": "[ANALYSIS: Deception probability 23%]" },
{ "turn": 8, "text": "[ANALYSIS: Deception probability 54%]" },
{ "turn": 14, "text": "[ALERT: Deception probability 89% — Subject lying]" }
```

---

## Template Files

See `/Users/gaia/DIRTY_DISC/disc-data.json` for a complete 10-scene example featuring Officer, Clancy, Filing Cabinets, Apparatus, Scholars, and Guest entities in an interrogation narrative.

---

**Generated with ♥ for the HOLO PROJECT**  
Part of the DIRTY DISC Archive · 2025
