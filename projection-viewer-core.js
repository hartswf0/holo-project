// PROJECTION VIEWER CORE - Universal Data Playback Engine
// Supports: disc-data.json, legos-multi-channel.json, legos-ring-memory.json

let currentData = null;
let scenes = [];
let currentSceneIndex = 0;
let viewMode = 'single'; // 'single' or 'multi'

// Audio System
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration = 100, volume = 0.05) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

let playbackState = {
  playing: false,
  currentTime: 0,
  speed: 1.0,  // NORMAL PACING - 1x speed for readability
  duration: 0,
  autoPlayMode: false,
  autoPlayInterval: null
};
let speechSynth = window.speechSynthesis;

// FORCE SINGLE VIEW MODE (TV Theatre) - all scenes on one grid
viewMode = 'single';

// Toggle View Mode (disabled - always single)
function toggleViewMode() {
  // ALWAYS STAY IN SINGLE MODE (TV theatre)
  viewMode = 'single';
  const container = document.querySelector('.panel-container');
  container.classList.toggle('multi-view', viewMode === 'multi');
  
  // Update button text
  const btn = document.getElementById('viewModeBtn');
  if (btn) {
    btn.textContent = viewMode === 'single' ? '⊞' : '⊟';
    btn.title = viewMode === 'single' ? 'Show All Scenes' : 'Show Single Scene';
  }
}

// Play All Scenes Simultaneously
function playAllScenes() {
  if (viewMode !== 'multi') {
    toggleViewMode();
  }
  
  // Start playback on all scenes
  scenes.forEach((scene, idx) => {
    playbackState.currentTime = 0;
    playbackState.playing = true;
    
    // Reset revealed state
    scene.timeline.forEach(event => {
      event._revealed = false;
      event._shown = false;
    });
    
    startPlayback(idx);
  });
}

// File Input Handler
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const loaderStatus = document.getElementById('loaderStatus');
    
    console.log(`📂 Loading file: ${file.name}`);
    if (loaderStatus) loaderStatus.textContent = `📂 Loading ${file.name}...`;
    
    const text = await file.text();
    console.log(`📄 File size: ${text.length} bytes`);
    if (loaderStatus) loaderStatus.textContent = `📄 Parsing ${(text.length/1024).toFixed(1)}KB...`;
    
    const data = JSON.parse(text);
    console.log('✅ JSON parsed successfully');
    if (loaderStatus) loaderStatus.textContent = '🔍 Detecting format...';
    
    const parsed = detectAndParse(data);
    
    console.log('📊 Parser returned:', parsed);
    
    if (!parsed) {
      throw new Error('Parser returned null/undefined');
    }
    
    if (!parsed.scenes) {
      console.error('❌ No scenes array in parsed data:', parsed);
      throw new Error('Parser returned invalid data structure - missing scenes array');
    }
    
    if (!Array.isArray(parsed.scenes)) {
      console.error('❌ scenes is not an array:', typeof parsed.scenes, parsed.scenes);
      throw new Error('scenes property is not an array');
    }
    
    if (parsed.scenes.length === 0) {
      throw new Error('No scenes found in data. Check data format.');
    }
    
    scenes = parsed.scenes;
    currentSceneIndex = 0;
    
    console.log(`✅ Loaded ${scenes.length} scenes from ${parsed.type}`);
    console.log('First scene:', scenes[0]);
    
    renderAllPanels();
  } catch (err) {
    const msg = `Error loading file: ${err.message}`;
    alert(msg);
    console.error('❌', msg, err);
  }
});

// Drag and Drop Support
const dropZone = document.body;

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.body.setAttribute('data-drag-active', 'true');
});

dropZone.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.body.removeAttribute('data-drag-active');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  document.body.removeAttribute('data-drag-active');
  
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/json') {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const parsed = detectAndParse(data);
      
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('Invalid data format - no scenes array found');
      }
      
      scenes = parsed.scenes;
      currentSceneIndex = 0;
      
      console.log(`📦 Dropped: ${scenes.length} scenes from ${parsed.type}`);
      
      renderAllPanels();
    } catch (err) {
      alert('Error loading dropped file: ' + err.message);
      console.error(err);
    }
  }
});

// Copy/Paste JSON Support
document.addEventListener('paste', async (e) => {
  const text = e.clipboardData.getData('text');
  if (!text) return;
  
  try {
    const data = JSON.parse(text);
    const parsed = detectAndParse(data);
    
    if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
      console.error('❌ Pasted data invalid:', parsed);
      return;
    }
    
    scenes = parsed.scenes;
    currentSceneIndex = 0;
    
    console.log(`📋 Pasted: ${scenes.length} scenes from ${parsed.type}`);
    
    renderAllPanels();
  } catch (err) {
    // Not JSON or invalid format - ignore
    console.log('Pasted text is not valid JSON data');
  }
});

// Preload disc-data.json on startup
async function preloadDiscData() {
  try {
    const response = await fetch('./disc-data.json');
    if (response.ok) {
      const data = await response.json();
      const parsed = detectAndParse(data);
      
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        console.error('❌ Preload failed: invalid parsed data', parsed);
        return;
      }
      
      scenes = parsed.scenes;
      currentSceneIndex = 0;
      
      console.log(`🎬 Preloaded: ${scenes.length} scenes from disc-data.json`);
      
      renderAllPanels();
      
      // Show TTS prompt after preload
      setTimeout(() => {
        if (confirm('🔊 Enable text-to-speech narration?')) {
          toggleTTS();
        }
      }, 500);
    }
  } catch (err) {
    console.log('No disc-data.json found, waiting for file upload...');
  }
}

// Auto-load on page load
window.addEventListener('DOMContentLoaded', preloadDiscData);

// TTS Prompt
function promptTTSEnable() {
  const prompt = document.createElement('div');
  prompt.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid #56ff9f;
    border-radius: 12px;
    padding: 24px 32px;
    z-index: 2000;
    text-align: center;
    box-shadow: 0 0 40px rgba(86, 255, 159, 0.6);
  `;
  prompt.innerHTML = `
    <div style="font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #56ff9f;">🔊 Enable Text-to-Speech?</div>
    <div style="font-size: 12px; color: #aaa; margin-bottom: 20px;">Messages will be spoken during playback</div>
    <button id="ttsYes" style="background: #56ff9f; color: #000; border: none; padding: 12px 24px; margin: 0 8px; border-radius: 8px; font-weight: 700; cursor: pointer;">Yes</button>
    <button id="ttsNo" style="background: #333; color: #aaa; border: none; padding: 12px 24px; margin: 0 8px; border-radius: 8px; font-weight: 700; cursor: pointer;">No</button>
  `;
  document.body.appendChild(prompt);
  
  document.getElementById('ttsYes').onclick = () => {
    // ENABLE TTS
    ttsEnabled = true;
    console.log('TTS enabled');
    prompt.remove();
  };
  
  document.getElementById('ttsNo').onclick = () => {
    // DISABLE TTS
    ttsEnabled = false;
    console.log('TTS disabled');
    prompt.remove();
  };
}

// Data Format Detection
function detectAndParse(data) {
  try {
    console.log('🔍 Detecting data format...', Object.keys(data));
    
    // Check for disc-data format
    if (data.scenes && data.global_elements_legend) {
      console.log('✅ Detected: disc-data format');
      const parsed = parseDiscData(data);
      console.log(`📊 Parsed ${parsed.scenes?.length || 0} scenes from disc-data`);
      
      // Ensure valid structure
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('parseDiscData returned invalid structure');
      }
      return parsed;
    }
    
    // Check for legos-multi-channel format
    if (data.channels && Array.isArray(data.channels)) {
      console.log('✅ Detected: LEGOS multi-channel format');
      const parsed = parseMultiChannel(data);
      console.log(`📊 Parsed ${parsed.scenes?.length || 0} scenes from LEGOS`);
      
      // Ensure valid structure
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('parseMultiChannel returned invalid structure');
      }
      return parsed;
    }
    
    // Check for raw conversation format (messages array)
    if (data.messages && Array.isArray(data.messages)) {
      console.log('✅ Detected: conversation messages format');
      const parsed = parseConversationMessages(data);
      console.log(`📊 Parsed ${parsed.scenes?.length || 0} scenes from messages`);
      
      // Ensure valid structure
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('parseConversationMessages returned invalid structure');
      }
      return parsed;
    }
    
    // Check for legos-ring-memory format
    if (data.entries && Array.isArray(data.entries)) {
      console.log('✅ Detected: ring-memory format');
      const parsed = parseRingMemory(data);
      console.log(`📊 Parsed ${parsed.scenes?.length || 0} scenes from ring-memory`);
      
      // Ensure valid structure
      if (!parsed || !parsed.scenes || !Array.isArray(parsed.scenes)) {
        throw new Error('parseRingMemory returned invalid structure');
      }
      return parsed;
    }
    
    console.error('❌ Unknown data format! Keys found:', Object.keys(data));
    throw new Error(`Unknown data format. Found keys: ${Object.keys(data).join(', ')}`);
    
  } catch (err) {
    console.error('❌ Error in detectAndParse:', err);
    console.error('   Data keys:', Object.keys(data));
    
    // Return empty but valid structure to prevent crashes
    return {
      type: 'error',
      title: 'Parse Error',
      scenes: []
    };
  }
}

// Parse disc-data.json format
function parseDiscData(data) {
  return {
    type: 'disc-data',
    title: data.story_title || 'Grid Animation',
    gridSize: data.global_settings.grid_dimensions,
    scenes: data.scenes.map(scene => {
      // Speed up timeline by reducing delays
      const timeline = (scene.animation_timeline || []).map(event => ({
        ...event,
        delay_seconds: (event.delay_seconds || 0) / 3, // 3x faster
        duration_seconds: Math.min(event.duration_seconds || 3, 3) // Cap at 3s
      }));
      
      // Calculate new duration based on sped-up timeline
      const maxTime = timeline.reduce((max, event) => 
        Math.max(max, (event.delay_seconds || 0) + (event.duration_seconds || 0)), 0);
      
      const oldDuration = scene.metadata?.scene_duration_seconds || 60;
      const newDuration = Math.max(maxTime + 2, 10);
      
      if (scene.scene_number === 1) {
        console.log(`⏱️ Timing optimized: ${oldDuration}s → ${newDuration.toFixed(1)}s (${timeline.length} events)`);
      }
      
      // Ensure grid is valid
      let grid = scene.initial_grid_layout;
      if (!grid || !Array.isArray(grid) || grid.length === 0) {
        console.warn(`⚠️ Scene ${scene.scene_number} has invalid grid, using empty`);
        grid = createEmptyGrid();
      }
      
      return {
        id: scene.scene_id,
        number: scene.scene_number,
        title: scene.title,
        subtitle: scene.subtitle,
        grid: grid,
        elements: scene.elements_in_scene || [],
        power: scene.power_distribution || {},
        timeline: timeline,
        duration: newDuration,
        metadata: scene.metadata
      };
    })
  };
}

// Parse legos-multi-channel.json format
function parseMultiChannel(data) {
  const scenes = [];
  
  if (!data.channels || !Array.isArray(data.channels)) {
    console.error('Invalid LEGOS format: missing channels array');
    return { type: 'legos-multi-channel', title: 'LEGOS Data', scenes: [] };
  }
  
  console.log(`📦 Parsing ${data.channels.length} LEGOS channels...`);
  
  data.channels.forEach((channel, channelIdx) => {
    try {
      console.log(`  Channel ${channelIdx}: ${channel.name || 'Unnamed'}`);
    
    // Check if channel has messages
    if (!channel.messages || !Array.isArray(channel.messages)) {
      console.warn(`  ⚠️ Channel ${channelIdx} has no messages, skipping`);
      return;
    }
    
    console.log(`  → ${channel.messages.length} messages found`);
    
    // Group messages into scenes
    const sceneGroups = [];
    let currentScene = [];
    
    channel.messages.forEach((msg, msgIdx) => {
      currentScene.push(msg);
      
      // Create scene every N messages or at system boundaries
      if (currentScene.length >= 5 || msg.role === 'system' && currentScene.length > 1) {
        sceneGroups.push([...currentScene]);
        currentScene = [];
      }
    });
    
    if (currentScene.length > 0) {
      sceneGroups.push(currentScene);
    }
    
    // Convert scenes
    sceneGroups.forEach((group, sceneIdx) => {
      // Safety check: ensure group is a valid array
      if (!group || !Array.isArray(group) || group.length === 0) {
        console.warn(`⚠️ Invalid scene group at ${channelIdx}:${sceneIdx}, skipping`);
        return;
      }
      
      // Ensure grid is valid - create empty if missing or invalid
      let gridState = channel.grid;
      if (!gridState || !Array.isArray(gridState) || gridState.length === 0) {
        console.log(`  → Creating empty grid for channel ${channelIdx}, scene ${sceneIdx}`);
        gridState = createEmptyGrid();
      }
      
      const power = channel.scorecard || {};
      
      scenes.push({
        id: `ch${channelIdx}_s${sceneIdx}`,
        number: scenes.length + 1,
        title: `${channel.name} - Scene ${sceneIdx + 1}`,
        subtitle: channel.scenario || 'Conversation',
        grid: gridState,
        elements: extractElementsFromGrid(gridState),
        power: {
          officer: { score: power.officer || 0.5 },
          clancy: { score: power.clancy || 0.5 },
          apparatus: { score: power.apparatus || 0.3 },
          scholars: { score: power.scholars || 0.2 }
        },
        timeline: group.map((msg, idx) => ({
          event_id: msg.id || `msg_${idx}`,
          type: msg.role === 'user' ? 'speech_bubble' : 'thinking_bubble',
          target_element_id: msg.role || 'user',
          text: msg.content || msg.text || '',
          display_type: msg.role === 'system' ? 'system' : 'speech',
          delay_seconds: idx * 5,
          duration_seconds: 4,
          timestamp: msg.timestamp
        })),
        duration: group.length * 5,
        metadata: {
          channelId: channel.id,
          channelColor: channel.channelColor
        }
      });
    });
    
    console.log(`  ✅ Created ${sceneGroups.length} scenes from channel ${channelIdx}`);
    
    } catch (err) {
      console.error(`❌ Error parsing channel ${channelIdx}:`, err);
      console.error('  Channel data:', channel);
    }
  });
  
  console.log(`📊 Total scenes created: ${scenes.length}`);
  
  return {
    type: 'legos-multi-channel',
    title: 'LEGOS Multi-Channel',
    scenes: scenes
  };
}

// Parse legos-ring-memory.json format
function parseRingMemory(data) {
  const scenes = [];
  const entriesPerScene = 5;
  
  for (let i = 0; i < data.entries.length; i += entriesPerScene) {
    const group = data.entries.slice(i, i + entriesPerScene);
    
    scenes.push({
      id: `ring_${i}`,
      number: scenes.length + 1,
      title: `Ring Memory ${scenes.length + 1}`,
      subtitle: `Entries ${i + 1}-${i + group.length}`,
      grid: createEmptyGrid(),
      elements: [],
      power: {
        system: { score: 0.7 },
        user: { score: 0.5 },
        memory: { score: 0.6 }
      },
      timeline: group.map((entry, idx) => ({
        event_id: entry.id,
        type: 'thinking_bubble',
        target_element_id: 'system',
        text: `${entry.headline}: ${entry.summary}`,
        display_type: 'thought',
        delay_seconds: idx * 4,
        duration_seconds: 3,
        timestamp: entry.timestamp
      })),
      duration: group.length * 4,
      metadata: {
        contextMode: data.contextMode,
        mainline: data.mainline
      }
    });
  }
  
  return {
    type: 'legos-ring-memory',
    title: 'Ring Memory Timeline',
    gridSize: { rows: 9, cols: 9 },
    scenes
  };
}

// Parse raw conversation messages format
function parseConversationMessages(data) {
  const scenes = [];
  const messagesPerScene = 5;
  
  if (!data.messages || !Array.isArray(data.messages)) {
    console.error('Invalid conversation format: missing messages array');
    return { type: 'conversation', title: 'Conversation', scenes: [] };
  }
  
  for (let i = 0; i < data.messages.length; i += messagesPerScene) {
    const group = data.messages.slice(i, i + messagesPerScene);
    
    scenes.push({
      id: `conv_${i}`,
      number: scenes.length + 1,
      title: data.title || `Conversation ${scenes.length + 1}`,
      subtitle: `Messages ${i + 1}-${i + group.length}`,
      grid: data.grid || createEmptyGrid(),
      elements: data.grid ? extractElementsFromGrid(data.grid) : [],
      power: data.power || {
        user: { score: 0.5 },
        assistant: { score: 0.5 }
      },
      timeline: group.map((msg, idx) => ({
        type: 'message',
        display_type: msg.role === 'system' ? 'system' : 'speech',
        target_element_id: msg.role,
        text: msg.content,
        delay_seconds: idx * 4,
        duration_seconds: 4,
        timestamp: msg.timestamp
      })),
      duration: group.length * 4,
      metadata: {
        conversationId: data.id
      }
    });
  }
  
  return {
    type: 'conversation',
    title: data.title || 'Conversation',
    scenes: scenes
  };
}

// Helper: Create empty 9x9 grid
function createEmptyGrid() {
  return Array(9).fill(null).map(() => Array(9).fill(''));
}

// Helper: Extract elements from grid state
function extractElementsFromGrid(grid) {
  const elements = [];
  
  // Safety check: ensure grid is a valid array
  if (!grid || !Array.isArray(grid)) {
    console.warn('⚠️ Invalid grid passed to extractElementsFromGrid, returning empty elements');
    return elements;
  }
  
  grid.forEach((row, r) => {
    // Safety check: ensure row is a valid array
    if (!row || !Array.isArray(row)) {
      console.warn(`⚠️ Invalid row ${r} in grid, skipping`);
      return;
    }
    
    row.forEach((cell, c) => {
      if (cell && cell !== '') {
        elements.push({
          id: `cell_${r}_${c}`,
          type: cell,
          grid_symbol: cell,
          initial_grid_position: { row: r + 1, col: c + 1 }
        });
      }
    });
  });
  return elements;
}

// Render All Panels (ALWAYS SINGLE VIEW - TV Theatre Mode)
function renderAllPanels() {
  const container = document.getElementById('panelContainer');
  container.innerHTML = '';
  
  // Hide loading state
  const loadingState = document.getElementById('loadingState');
  if (loadingState) {
    loadingState.style.display = 'none';
    console.log('👋 Welcome screen hidden (press ? button to reopen)');
    
    // Verify it's actually hidden
    setTimeout(() => {
      const computedDisplay = window.getComputedStyle(loadingState).display;
      const computedZIndex = window.getComputedStyle(loadingState).zIndex;
      console.log('🔍 Loading screen check:', {
        display: computedDisplay,
        zIndex: computedZIndex,
        visible: computedDisplay !== 'none'
      });
      if (computedDisplay !== 'none') {
        console.error('⚠️ Loading screen is still visible! Force hiding...');
        loadingState.remove();
      }
    }, 100);
  }
  
  // FORCE SINGLE VIEW (horizontal scrolling panels)
  container.classList.remove('multi-view');
  viewMode = 'single';
  
  console.log(`📱 Horizontal Scroll: Rendering ${scenes.length} scenes side-by-side`);
  
  if (!scenes || scenes.length === 0) {
    console.error('❌ No scenes to render!');
    return;
  }
  
  scenes.forEach((scene, idx) => {
    try {
      const panel = createScenePanel(scene, idx);
      if (panel) {
        container.appendChild(panel);
        console.log(`✅ Panel ${idx + 1} created: ${scene.title || 'Untitled'}`);
      } else {
        console.error(`❌ Panel ${idx + 1} failed to create`);
      }
    } catch (err) {
      console.error(`❌ Error creating panel ${idx + 1}:`, err);
    }
  });
  
  console.log(`✅ All ${scenes.length} panels rendered to DOM`);
  
  // Update scene counter
  updateSceneCounter();
  
  // CRITICAL: Hide ALL overlays that might be covering the panels!
  const loaderStatus = document.getElementById('loaderStatus');
  if (loaderStatus) {
    loaderStatus.textContent = `✅ ${scenes.length} panels ready! Showing...`;
  }
  
  const loader = document.getElementById('loader');
  if (loader) {
    // Fade out then hide
    loader.style.transition = 'opacity 0.3s ease';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.style.display = 'none';
      console.log('✅ Loader overlay hidden');
    }, 300);
  } else {
    console.log('⚠️ Loader element not found');
  }
  
  // Make absolutely sure panels are visible
  container.style.display = 'block';
  container.style.visibility = 'visible';
  container.style.opacity = '1';
  console.log('✅ Container visibility forced');
  
  // DEBUG: Check what's actually in the DOM
  console.log('🔍 DOM Debug:');
  console.log('  - Container element:', container);
  console.log('  - Container children:', container.children.length);
  console.log('  - Container display:', window.getComputedStyle(container).display);
  console.log('  - Container height:', window.getComputedStyle(container).height);
  console.log('  - Container overflow-y:', window.getComputedStyle(container).overflowY);
  console.log('  - First panel:', container.children[0]);
  if (container.children[0]) {
    const panel = container.children[0];
    console.log('  - First panel display:', window.getComputedStyle(panel).display);
    console.log('  - First panel height:', window.getComputedStyle(panel).height);
    console.log('  - First panel visibility:', window.getComputedStyle(panel).visibility);
    console.log('  - First panel z-index:', window.getComputedStyle(panel).zIndex);
  }
  
  // Add corner buttons
  addCornerButtons();
}

// Create Scene Dots (navigation beside grid)
function createSceneDots(currentIndex) {
  const container = document.createElement('div');
  container.className = 'scene-dots-rail';
  
  scenes.forEach((scene, idx) => {
    const dot = document.createElement('div');
    dot.className = 'scene-nav-dot';
    if (idx === currentIndex) dot.classList.add('active');
    if (idx === currentSceneIndex) dot.classList.add('playing');
    dot.dataset.sceneIndex = idx;
    dot.title = `Scene ${idx + 1}: ${scene.title || 'Untitled'}`;
    
    // Click to jump to scene AND START PLAYING
    dot.addEventListener('click', () => {
      const container = document.getElementById('panelContainer');
      const panels = container.querySelectorAll('.scene-panel');
      panels[idx].scrollIntoView({ behavior: 'smooth' });
      
      // Reset and start playing from this scene
      playbackState.currentTime = 0;
      playbackState.playing = true;
      currentSceneIndex = idx;
      updateSceneDots();
      
      // Update all play buttons
      document.querySelectorAll('.scene-play-btn').forEach((btn, btnIdx) => {
        if (btnIdx === idx) {
          btn.innerHTML = '⏸ PAUSE';
          btn.classList.add('playing');
        } else {
          btn.innerHTML = '▶ PLAY';
          btn.classList.remove('playing');
        }
      });
      
      startPlayback(idx);
    });
    
    container.appendChild(dot);
  });
  
  return container;
}

function updateSceneDots() {
  document.querySelectorAll('.scene-nav-dot').forEach((dot, idx) => {
    dot.classList.toggle('playing', idx === currentSceneIndex);
  });
}

// Create Scene Panel
function createScenePanel(scene, index) {
  const panel = document.createElement('div');
  panel.className = 'scene-panel';
  panel.dataset.sceneIndex = index;
  
  // Grid Section (resizable)
  const gridSection = document.createElement('div');
  gridSection.className = 'grid-section';
  
  // Grid Area
  const gridArea = document.createElement('div');
  gridArea.className = 'grid-area';
  
  // SCENE DOTS (beside grid)
  const sceneDots = createSceneDots(index);
  gridArea.appendChild(sceneDots);
  
  // BIG PLAY BUTTON
  const playBtn = document.createElement('button');
  playBtn.className = 'scene-play-btn';
  playBtn.innerHTML = '▶ PLAY';
  playBtn.dataset.sceneIndex = index;
  playBtn.addEventListener('click', () => {
    if (!playbackState.playing) {
      playbackState.playing = true;
      playBtn.innerHTML = '⏸ PAUSE';
      playBtn.classList.add('playing');
      startPlayback(index);
    } else {
      playbackState.playing = false;
      playBtn.innerHTML = '▶ PLAY';
      playBtn.classList.remove('playing');
    }
  });
  gridArea.appendChild(playBtn);
  
  const gridWrapper = document.createElement('div');
  gridWrapper.className = 'grid-wrapper';
  
  // Grid (power bars removed - now in timeline)
  const grid = createGrid(scene.grid, scene.elements);
  gridWrapper.appendChild(grid);
  
  gridArea.appendChild(gridWrapper);
  gridSection.appendChild(gridArea);
  
  // Resize Bar
  const resizeBar = createResizeBar(gridSection);
  
  // Timeline Section (resizable)
  const timelineSection = document.createElement('div');
  timelineSection.className = 'timeline-section';
  
  const timelineArea = createTimelineArea(scene, index);
  timelineSection.appendChild(timelineArea);
  
  panel.appendChild(gridSection);
  panel.appendChild(resizeBar);
  panel.appendChild(timelineSection);
  
  return panel;
}

// Create Grid
function createGrid(gridData, elements) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      const symbol = gridData[r]?.[c] || '';
      if (symbol) {
        // Find matching element
        const element = elements.find(el => 
          el.initial_grid_position?.row === r + 1 && 
          el.initial_grid_position?.col === c + 1
        );
        
        // Determine entity ID and type
        const entityId = element?.id || 'unknown';
        const entityType = element?.type || element?.id || 'default';
        const entityName = element?.name || element?.id || 'Unknown';
        
        // Get style based on type first, then ID
        let style = getEntityStyle(entityType);
        if (style === entityStyles['default']) {
          style = getEntityStyle(entityId);
        }
        
        // Show ORIGINAL GRID SYMBOL first, then style symbol as fallback
        const displaySymbol = symbol || style.symbol || '?';
        cell.textContent = displaySymbol;
        cell.classList.add('occupied');
        cell.dataset.symbol = symbol;
        cell.dataset.entityId = entityId;
        cell.dataset.entityType = entityType;
        cell.dataset.entityName = entityName;
        cell.style.color = style.color;
        cell.style.fontSize = '18px';  // Larger for readability
        
        // Debug log for unknown entities
        if (displaySymbol === '?') {
          console.log(`⚠️ Unknown entity at (${r},${c}): ID="${entityId}", Type="${entityType}", GridSymbol="${symbol}"`, element);
        }
        
        // Add cell type for animations
        cell.dataset.cellType = entityType;
      }
      
      // Click to highlight related messages
      cell.addEventListener('click', () => {
        highlightRelatedMessages(cell.dataset.entityId);
      });
      
      grid.appendChild(cell);
    }
  }
  
  return grid;
}

// Create Resize Bar with drag functionality
function createResizeBar(gridSection) {
  const resizeBar = document.createElement('div');
  resizeBar.className = 'resize-bar';
  
  let isResizing = false;
  let startY = 0;
  let startHeight = 0;
  
  // Mouse events
  resizeBar.addEventListener('mousedown', (e) => {
    isResizing = true;
    startY = e.clientY;
    startHeight = gridSection.offsetHeight;
    document.body.style.cursor = 'row-resize';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const delta = e.clientY - startY;
    const newHeight = Math.max(200, Math.min(window.innerHeight * 0.75, startHeight + delta));
    gridSection.style.flex = `0 0 ${newHeight}px`;
    gridSection.style.height = `${newHeight}px`;
  });
  
  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });
  
  // Touch events for mobile
  resizeBar.addEventListener('touchstart', (e) => {
    isResizing = true;
    startY = e.touches[0].clientY;
    startHeight = gridSection.offsetHeight;
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isResizing) return;
    const delta = e.touches[0].clientY - startY;
    const newHeight = Math.max(200, Math.min(window.innerHeight * 0.75, startHeight + delta));
    gridSection.style.flex = `0 0 ${newHeight}px`;
    gridSection.style.height = `${newHeight}px`;
  });
  
  document.addEventListener('touchend', () => {
    if (isResizing) {
      isResizing = false;
    }
  });
  
  return resizeBar;
}

// Create Timeline Area with Chat Stream
function createTimelineArea(scene, sceneIndex) {
  const area = document.createElement('div');
  area.className = 'timeline-area';
  
  // BIG TIME DISPLAY - shows current playback time
  const timeDisplay = document.createElement('div');
  timeDisplay.className = 'time-display';
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  timeDisplay.innerHTML = `
    <div class="time-current">0:00</div>
    <div class="time-separator">/</div>
    <div class="time-total">${formatTime(totalDuration)}</div>
  `;
  area.appendChild(timeDisplay);
  
  // GLOBAL Timeline Grid (all scenes)
  const timelineGrid = createGlobalTimelineGrid(sceneIndex);
  area.appendChild(timelineGrid);
  
  // Chat Stream with message dots
  const chatStream = createChatStream(scene.timeline, sceneIndex);
  area.appendChild(chatStream);
  
  return area;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Create GLOBAL Timeline Grid - shows ALL scenes
function createGlobalTimelineGrid(currentSceneIndex) {
  const container = document.createElement('div');
  container.className = 'timeline-grid-container global-timeline';
  
  const grid = document.createElement('div');
  grid.className = 'timeline-grid';
  
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  
  // Create a segment for each scene
  let cumulativeTime = 0;
  scenes.forEach((scene, idx) => {
    const sceneWidth = (scene.duration / totalDuration) * 100;
    
    const sceneSegment = document.createElement('div');
    sceneSegment.className = 'timeline-scene-segment';
    sceneSegment.style.width = `${sceneWidth}%`;
    sceneSegment.dataset.sceneIndex = idx;
    sceneSegment.dataset.timeStart = cumulativeTime;
    sceneSegment.dataset.timeEnd = cumulativeTime + scene.duration;
    
    // Add scene label
    const label = document.createElement('div');
    label.className = 'scene-segment-label';
    label.textContent = `${idx + 1}`;
    sceneSegment.appendChild(label);
    
    // Add sub-timeline (events within scene)
    const subTimeline = document.createElement('div');
    subTimeline.className = 'sub-timeline';
    scene.timeline.forEach((event, eventIdx) => {
      const eventMarker = document.createElement('div');
      eventMarker.className = 'event-marker';
      const eventPercent = (event.delay_seconds / scene.duration) * 100;
      eventMarker.style.left = `${eventPercent}%`;
      
      // Color by entity
      const style = getEntityStyle(event.target_element_id);
      eventMarker.style.background = style.color;
      eventMarker.title = `${style.label}: ${event.text?.substring(0, 30) || event.type}`;
      
      subTimeline.appendChild(eventMarker);
    });
    sceneSegment.appendChild(subTimeline);
    
    // Highlight current scene
    if (idx === currentSceneIndex) {
      sceneSegment.classList.add('active');
    }
    
    // Click to jump to scene AND START PLAYING
    sceneSegment.addEventListener('click', () => {
      const container = document.getElementById('panelContainer');
      const panels = container.querySelectorAll('.scene-panel');
      panels[idx].scrollIntoView({ behavior: 'smooth' });
      
      // Reset and start playing from this scene
      playbackState.currentTime = 0;
      playbackState.playing = true;
      currentSceneIndex = idx;
      updateSceneDots();
      
      // Update all play buttons
      document.querySelectorAll('.scene-play-btn').forEach((btn, btnIdx) => {
        if (btnIdx === idx) {
          btn.innerHTML = '⏸ PAUSE';
          btn.classList.add('playing');
        } else {
          btn.innerHTML = '▶ PLAY';
          btn.classList.remove('playing');
        }
      });
      
      startPlayback(idx);
    });
    
    grid.appendChild(sceneSegment);
    cumulativeTime += scene.duration;
  });
  
  // Global playhead
  const playhead = document.createElement('div');
  playhead.className = 'timeline-playhead global-playhead';
  playhead.style.left = '0%';
  
  container.appendChild(grid);
  container.appendChild(playhead);
  
  return container;
}

// Create Timeline Grid - single row of temporal cells
function createTimelineGrid(timeline, duration, sceneIndex) {
  const container = document.createElement('div');
  container.className = 'timeline-grid-container';
  
  const grid = document.createElement('div');
  grid.className = 'timeline-grid';
  
  // Calculate cells - one cell per event or time segment
  const cellCount = Math.min(timeline.length, 20); // Cap at 20 cells for readability
  const timePerCell = duration / cellCount;
  
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    cell.className = 'timeline-cell';
    cell.dataset.cellIndex = i;
    cell.dataset.timeStart = i * timePerCell;
    cell.dataset.timeEnd = (i + 1) * timePerCell;
    
    // Find events in this time segment
    const eventsInCell = timeline.filter(event => 
      event.delay_seconds >= i * timePerCell && 
      event.delay_seconds < (i + 1) * timePerCell
    );
    
    if (eventsInCell.length > 0) {
      cell.classList.add('has-event');
      // Use first event's type for styling
      const eventType = eventsInCell[0].display_type || eventsInCell[0].type;
      cell.dataset.eventType = eventType;
      
      // Get entity style for color
      const entityId = eventsInCell[0].target_element_id;
      const style = getEntityStyle(entityId);
      cell.style.borderColor = style.color;
      cell.style.backgroundColor = `${style.color}22`;
      
      // Show time on hover
      const time = Math.floor(i * timePerCell);
      cell.title = `${time}s`;
    }
    
    // Click to jump to this time
    cell.addEventListener('click', () => {
      playbackState.currentTime = i * timePerCell;
      updateTimelinePosition(sceneIndex);
    });
    
    grid.appendChild(cell);
  }
  
  // Add playhead indicator
  const playhead = document.createElement('div');
  playhead.className = 'timeline-playhead';
  container.appendChild(grid);
  container.appendChild(playhead);
  
  return container;
}

// Create Chat Stream (like thousand-tetrad)
function createChatStream(timeline, sceneIndex) {
  const stream = document.createElement('div');
  stream.className = 'chat-stream';
  
  // Message Dot Rail
  const dotRail = document.createElement('div');
  dotRail.className = 'message-dot-rail';
  
  // Message List
  const messageList = document.createElement('div');
  messageList.className = 'message-list';
  
  timeline.forEach((event, idx) => {
    // Create dot
    const dot = createMessageDot(event, idx);
    dot.addEventListener('click', () => {
      toggleMessage(sceneIndex, idx);
      jumpToEvent(sceneIndex, event);
    });
    dotRail.appendChild(dot);
    
    // Create message
    const message = createMessage(event, idx, sceneIndex);
    messageList.appendChild(message);
  });
  
  stream.appendChild(dotRail);
  stream.appendChild(messageList);
  
  return stream;
}

// Entity color/emoji mapping (compact names + LEGOS types)
const entityStyles = {
  // Disc-data entities
  'officer_main': { color: '#56ff9f', emoji: '👮', label: 'Officer', compact: 'OFF', symbol: 'O' },
  'clancy_main': { color: '#569fff', emoji: '🧑', label: 'Clancy', compact: 'CLA', symbol: 'C' },
  'apparatus': { color: '#ff9f56', emoji: '⚙️', label: 'Apparatus', compact: 'APP', symbol: 'A' },
  'scholars': { color: '#f3ae56', emoji: '📚', label: 'Scholar', compact: 'SCH', symbol: 'S' },
  'scholar_1': { color: '#f3ae56', emoji: '📚', label: 'Scholar', compact: 'SCH', symbol: 'S' },
  'guest': { color: '#c78fff', emoji: '👤', label: 'Guest', compact: 'GST', symbol: 'G' },
  
  // LEGOS entity types
  'Entity': { color: '#56ff9f', emoji: '🧑', label: 'Entity', compact: 'ENT', symbol: 'E' },
  'Location': { color: '#569fff', emoji: '📍', label: 'Location', compact: 'LOC', symbol: 'L' },
  'Obstacle': { color: '#ff5c7c', emoji: '🚧', label: 'Obstacle', compact: 'OBS', symbol: 'X' },
  'Solution': { color: '#56ff9f', emoji: '✨', label: 'Solution', compact: 'SOL', symbol: '✓' },
  'Shift': { color: '#c78fff', emoji: '🔄', label: 'Shift', compact: 'SHF', symbol: '~' },
  'Goal': { color: '#f8d66a', emoji: '🎯', label: 'Goal', compact: 'GOL', symbol: '★' },
  
  // Message roles
  'user': { color: '#569fff', emoji: '👤', label: 'User', compact: 'USR', symbol: 'U' },
  'assistant': { color: '#56ff9f', emoji: '🤖', label: 'AI', compact: 'AST', symbol: 'AI' },
  'system': { color: '#888', emoji: '🖥️', label: 'System', compact: 'SYS', symbol: '⚙' },
  
  'default': { color: '#aef3c1', emoji: '💬', label: 'Unknown', compact: '???', symbol: '?' }
};

function getEntityStyle(target) {
  // Handle undefined/null/non-string target
  if (!target || typeof target !== 'string') return entityStyles['default'];
  
  // Try exact match first
  if (entityStyles[target]) return entityStyles[target];
  
  // Try partial match
  const lowTarget = target.toLowerCase();
  for (const [key, style] of Object.entries(entityStyles)) {
    if (lowTarget.includes(key.toLowerCase()) || key.toLowerCase().includes(lowTarget)) {
      return style;
    }
  }
  
  return entityStyles['default'];
}

// Create Message Dot - NUMBER + GRID SYMBOL
function createMessageDot(event, index) {
  const dot = document.createElement('div');
  dot.className = 'message-dot hidden'; // Start hidden!
  dot.dataset.eventIndex = index;
  dot.dataset.messageIndex = index;
  dot.dataset.timestamp = event.delay_seconds;
  
  const style = getEntityStyle(event.target_element_id);
  dot.style.color = style.color;
  dot.style.background = `rgba(${hexToRgb(style.color)}, 0.2)`;
  
  // Show NUMBER (keep sequential numbering)
  dot.textContent = (index + 1).toString();
  
  // Add grid symbol as tooltip
  dot.title = `${style.symbol} ${style.label} - ${event.delay_seconds.toFixed(1)}s`;
  
  // NO auto-reveal - will be revealed during playback
  
  return dot;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

// Create Message Card
function createMessage(event, idx, sceneIndex) {
  const message = document.createElement('div');
  message.className = 'message-card hidden'; // Start hidden!
  message.dataset.eventIndex = idx;
  message.dataset.entityId = event.target_element_id;
  message.dataset.timestamp = event.delay_seconds;
  
  const style = getEntityStyle(event.target_element_id);
  message.style.borderLeftColor = style.color;
  
  // Header with GRID SYMBOL and clearer speaker name
  const header = document.createElement('div');
  header.className = 'message-header';
  header.innerHTML = `
    <span class="message-color-dot" style="color: ${style.color}; background: rgba(${hexToRgb(style.color)}, 0.2); padding: 4px 8px; border-radius: 4px; font-weight: 900;">${style.symbol}</span>
    <span class="message-entity" style="font-weight: 700; font-size: 13px;">${style.label}</span>
    <span class="message-time">${event.delay_seconds.toFixed(1)}s</span>
  `;
  
  // Preview (shown when collapsed)
  const preview = document.createElement('div');
  preview.className = 'message-preview';
  preview.textContent = (event.text || '').substring(0, 50) + '...';
  
  // Body
  const body = document.createElement('div');
  body.className = 'message-body';
  body.textContent = event.text || event.type;
  
  // Click message → HIGHLIGHT GRID CELL + SCROLL TO IT
  message.addEventListener('click', (e) => {
    // Toggle collapsed state
    message.classList.toggle('collapsed');
    
    // Highlight grid cell and flash animation
    const entityId = event.target_element_id;
    if (entityId) {
      const panel = document.querySelectorAll('.scene-panel')[sceneIndex];
      const grid = panel?.querySelector('.grid');
      if (grid) {
        grid.querySelectorAll('.grid-cell').forEach(cell => {
          const cellEntityId = cell.dataset.entityId;
          if (cellEntityId && cellEntityId.toLowerCase().includes(entityId.toLowerCase())) {
            cell.classList.add('highlighted');
            cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            playTone(440, 60, 0.03);
            setTimeout(() => cell.classList.remove('highlighted'), 1500);
          }
        });
      }
    }
    
    // Speak text if TTS enabled
    if (!message.classList.contains('collapsed')) {
      speakText(event.text, event.display_type);
    }
  });
  
  message.appendChild(header);
  message.appendChild(preview);
  message.appendChild(body);
  
  // NO auto-reveal - will be revealed during playback
  
  return message;
}

// Toggle Message Collapse
function toggleMessage(sceneIndex, messageIndex) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  const messages = panel.querySelectorAll('.message');
  const message = messages[messageIndex];
  if (message) {
    message.classList.toggle('collapsed');
  }
}

// Highlight grid cell when message is clicked
function highlightGridCell(entityId, sceneIndex) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  // Clear previous highlights
  panel.querySelectorAll('.grid-cell.highlighted').forEach(cell => {
    cell.classList.remove('highlighted');
  });
  
  // Highlight matching cells with ripple effect
  panel.querySelectorAll('.grid-cell').forEach(cell => {
    const cellEntityId = cell.dataset.entityId;
    if (cellEntityId && entityId && cellEntityId.toLowerCase().includes(entityId.toLowerCase())) {
      cell.classList.add('highlighted');
      
      // Add ripple animation
      cell.classList.add('ripple');
      setTimeout(() => cell.classList.remove('ripple'), 800);
    }
  });
}

// GRID CLICK → HIGHLIGHT & SCROLL TO MESSAGES
function highlightRelatedMessages(entityId) {
  if (!entityId) return;
  
  // Get current panel
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[currentSceneIndex];
  if (!panel) return;
  
  const messages = panel.querySelectorAll('.message-card');
  const dots = panel.querySelectorAll('.message-dot');
  const messageList = panel.querySelector('.message-list');
  
  // Clear previous highlights
  messages.forEach(m => m.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  
  let firstMatch = null;
  
  // Highlight matching messages using dataset.entityId
  messages.forEach((message, idx) => {
    const messageEntityId = message.dataset.entityId;
    // Check if message relates to this entity (partial match)
    if (messageEntityId && (
        messageEntityId.toLowerCase().includes(entityId.toLowerCase()) || 
        entityId.toLowerCase().includes(messageEntityId.toLowerCase()))) {
      message.classList.add('active');
      if (dots[idx]) dots[idx].classList.add('active');
      
      // Expand message
      if (message.classList.contains('collapsed')) {
        message.classList.remove('collapsed');
      }
      
      // Track first match for scrolling
      if (!firstMatch) firstMatch = message;
    }
  });
  
  // Scroll to first matching message
  if (firstMatch && messageList) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    playTone(523, 80, 0.04);  // Message highlight tone
  }
}

// Global Footer - Scene Selector
function renderGlobalFooter() {
  const select = document.getElementById('globalSceneSelect');
  select.innerHTML = '';
  
  scenes.forEach((scene, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `Scene ${scene.number}: ${scene.title}`;
    if (idx === 0) option.selected = true;
    select.appendChild(option);
  });
  
  // Scene selector change handler
  select.addEventListener('change', (e) => {
    navigateToScene(parseInt(e.target.value));
  });
  
  // Grid collapse button
  const collapseBtn = document.getElementById('gridCollapseBtn');
  collapseBtn.addEventListener('click', () => {
    const gridSections = document.querySelectorAll('.grid-section');
    gridSections.forEach(section => {
      section.classList.toggle('collapsed');
    });
    collapseBtn.textContent = gridSections[0].classList.contains('collapsed') ? '⊞' : '⊟';
  });
}

function updateSceneCounter() {
  const currentEl = document.getElementById('currentScene');
  const totalEl = document.getElementById('totalScenes');
  
  if (currentEl) currentEl.textContent = currentSceneIndex + 1;
  if (totalEl) totalEl.textContent = scenes.length;
}

function navigateToScene(index) {
  const container = document.getElementById('panelContainer');
  const panel = container.children[index];
  panel.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  
  // Update dropdown
  const select = document.getElementById('globalSceneSelect');
  if (select) select.value = index;
  
  currentSceneIndex = index;
  playbackState.currentTime = 0;
  playbackState.playing = false;
  
  updateSceneCounter();
  
  // Update play button
  const playBtn = document.querySelector('.corner-btn.top-left');
  if (playBtn) {
    playBtn.textContent = '▶';
    playBtn.dataset.playing = 'false';
  }
  
  // Update scene info
  updateSceneInfo();
  
  // Close all menus
  document.querySelectorAll('.corner-menu').forEach(menu => {
    menu.classList.remove('visible');
  });
}

// Playback Controls
function togglePlayback(sceneIndex) {
  playbackState.playing = !playbackState.playing;
  const btn = document.querySelectorAll('.btn')[sceneIndex * 3];
  btn.textContent = playbackState.playing ? '⏸ PAUSE' : '▶ PLAY';
  
  if (playbackState.playing) {
    startPlayback(sceneIndex);
  }
}

function startPlayback(sceneIndex) {
  const scene = scenes[sceneIndex];
  const startTime = Date.now();
  const initialTime = playbackState.currentTime;
  
  // Update current scene index
  currentSceneIndex = sceneIndex;
  
  function animate() {
    if (!playbackState.playing) return;
    
    const elapsed = (Date.now() - startTime) / 1000 * playbackState.speed;
    playbackState.currentTime = initialTime + elapsed;
    
    if (playbackState.currentTime >= scene.duration) {
      // ADVANCE TO NEXT SCENE
      const nextSceneIndex = sceneIndex + 1;
      if (nextSceneIndex < scenes.length) {
        console.log(`Scene ${sceneIndex} finished, advancing to scene ${nextSceneIndex}`);
        // SCENE CHANGE TONE (659Hz - high pitch)
        playTone(659, 150, 0.06);
        playbackState.currentTime = 0;
        
        // UPDATE CURRENT SCENE INDEX
        currentSceneIndex = nextSceneIndex;
        
        // Scroll to next scene if in single view
        if (viewMode === 'single') {
          const container = document.getElementById('panelContainer');
          const panels = container.querySelectorAll('.scene-panel');
          panels[nextSceneIndex].scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update scene dots
        updateSceneDots();
        
        // Update play buttons
        const allBtns = document.querySelectorAll('.scene-play-btn');
        allBtns.forEach((btn, idx) => {
          if (idx === sceneIndex) {
            btn.innerHTML = '▶ PLAY';
            btn.classList.remove('playing');
          } else if (idx === nextSceneIndex) {
            btn.innerHTML = '⏸ PAUSE';
            btn.classList.add('playing');
          }
        });
        
        // Start next scene
        startPlayback(nextSceneIndex);
      } else {
        // End of all scenes
        console.log('All scenes completed!');
        playbackState.playing = false;
        playbackState.currentTime = 0;
        const btn = document.querySelector(`[data-scene-index="${sceneIndex}"]`);
        if (btn) {
          btn.innerHTML = '▶ PLAY';
          btn.classList.remove('playing');
        }
      }
      return;
    }
    
    checkEvents(sceneIndex);
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

function checkEvents(sceneIndex) {
  const scene = scenes[sceneIndex];
  const currentTime = playbackState.currentTime;
  
  // Update timeline position
  updateTimelinePosition(sceneIndex);
  
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  scene.timeline.forEach((event, idx) => {
    const start = event.delay_seconds;
    const end = start + event.duration_seconds;
    
    // REVEAL message when its time arrives
    if (currentTime >= start && !event._revealed) {
      revealMessage(sceneIndex, idx);
      event._revealed = true;
    }
    
    // Event active right now
    if (currentTime >= start && currentTime < end) {
      highlightEvent(sceneIndex, idx);
      
      // Flash grid cell
      const entityId = event.target_element_id;
      if (entityId) {
        flashGridCell(sceneIndex, entityId);
      }
      
      // Show bubble (only once per event)
      if (!event._shown && event.text) {
        showBubble(sceneIndex, event);
        speakText(event.text, event.display_type);
        event._shown = true;
      }
    } else {
      event._shown = false;
    }
  });
}

function revealMessage(sceneIndex, eventIndex) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  const messages = panel.querySelectorAll('.message-card');
  const dots = panel.querySelectorAll('.message-dot');
  const messageList = panel.querySelector('.message-list');
  
  const message = messages[eventIndex];
  const dot = dots[eventIndex];
  
  if (message) {
    message.classList.remove('hidden');
    message.classList.add('reveal');
    
    // MESSAGE REVEAL TONE (523Hz - higher pitch)
    playTone(523, 80, 0.04);
    
    // STRONG Auto-scroll - lock to bottom
    if (messageList) {
      setTimeout(() => {
        messageList.scrollTop = messageList.scrollHeight;
      }, 50);
    }
  }
  
  if (dot) {
    dot.classList.remove('hidden');
    dot.classList.add('reveal');
  }
}

function flashGridCell(sceneIndex, entityId) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  panel.querySelectorAll('.grid-cell').forEach(cell => {
    const cellEntityId = cell.dataset.entityId;
    if (cellEntityId && entityId && cellEntityId.toLowerCase().includes(entityId.toLowerCase())) {
      cell.classList.add('ripple');
      // GRID FLASH TONE (440Hz - middle pitch)
      playTone(440, 60, 0.03);
      setTimeout(() => cell.classList.remove('ripple'), 800);
    }
  });
}

function highlightEvent(sceneIndex, eventIndex) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  const messages = panel.querySelectorAll('.message-card');
  const dots = panel.querySelectorAll('.message-dot');
  const messageList = panel.querySelector('.message-list');
  
  messages.forEach((message, idx) => {
    message.classList.toggle('active', idx === eventIndex);
    
    // Auto-scroll active message into view
    if (idx === eventIndex && messageList) {
      message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
  
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === eventIndex);
  });
}

function jumpToEvent(sceneIndex, event) {
  playbackState.currentTime = event.delay_seconds;
  updateTimelinePosition(sceneIndex);
  // Message will be highlighted via checkEvents during playback
}

function updateTimelinePosition(sceneIndex) {
  const panels = document.querySelectorAll('.scene-panel');
  const panel = panels[sceneIndex];
  if (!panel) return;
  
  const scene = scenes[sceneIndex];
  
  // Calculate GLOBAL time (cumulative across scenes)
  let globalTime = 0;
  for (let i = 0; i < sceneIndex; i++) {
    globalTime += scenes[i].duration;
  }
  globalTime += playbackState.currentTime;
  
  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);
  
  // Update ALL playheads
  document.querySelectorAll('.timeline-playhead').forEach(playhead => {
    const percent = (globalTime / totalDuration) * 100;
    playhead.style.left = `${percent}%`;
  });
  
  // UPDATE BIG TIME DISPLAY (show global time)
  document.querySelectorAll('.time-display').forEach(timeDisplay => {
    const timeCurrent = timeDisplay.querySelector('.time-current');
    if (timeCurrent) {
      timeCurrent.textContent = formatTime(globalTime);
    }
  });
  
  // Highlight active scene segment
  document.querySelectorAll('.timeline-scene-segment').forEach((segment, idx) => {
    segment.classList.toggle('active', idx === sceneIndex);
  });
}

// Message becomes GRID ENTITY (LEGOS block)
function showBubble(sceneIndex, event) {
  const panel = document.querySelectorAll('.scene-panel')[sceneIndex];
  const grid = panel.querySelector('.grid');
  if (!grid) return;
  
  const entityId = event.target_element_id;
  const style = getEntityStyle(entityId);
  
  // Find entity's cell to place message nearby
  const cells = Array.from(grid.querySelectorAll('.grid-cell'));
  const entityCell = cells.find(cell => 
    cell.dataset.entityId?.toLowerCase().includes(entityId?.toLowerCase() || '')
  );
  
  if (!entityCell) {
    console.log('⚠️ Entity not found on grid');
    return;
  }
  
  // Flash the entity cell
  entityCell.classList.add('speaking');
  setTimeout(() => entityCell.classList.remove('speaking'), 800);
  
  // Find nearest empty cell for message
  const entityRow = parseInt(entityCell.dataset.row);
  const entityCol = parseInt(entityCell.dataset.col);
  const emptyCell = findNearestEmpty(cells, entityRow, entityCol);
  
  if (!emptyCell) {
    console.log('⚠️ No empty cell for message');
    return;
  }
  
  // Transform empty cell INTO message entity
  const text = event.text || '';
  const preview = text.length > 8 ? text.substring(0, 8) + '...' : text;
  
  emptyCell.textContent = '💬';
  emptyCell.classList.add('occupied', 'message-entity');
  emptyCell.style.color = style.color;
  emptyCell.dataset.entityId = entityId + '_msg';
  emptyCell.dataset.messageText = text;
  emptyCell.title = `${style.label}: ${text}`;
  
  console.log(`💬 Message entity created at (${emptyCell.dataset.row},${emptyCell.dataset.col}): "${preview}"`);
  
  // TTS - speak the message
  if (ttsEnabled && event.text) {
    speakText(event.text, event.display_type);
  }
  
  // Remove message entity after duration
  const duration = Math.max(event.duration_seconds || 3, 5) * 1000;
  setTimeout(() => {
    emptyCell.textContent = '';
    emptyCell.classList.remove('occupied', 'message-entity');
    emptyCell.style.color = '';
    delete emptyCell.dataset.entityId;
    delete emptyCell.dataset.messageText;
    emptyCell.title = '';
  }, duration);
}

// Find nearest empty cell for message placement
function findNearestEmpty(cells, entityRow, entityCol) {
  const gridSize = 9;
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],  // Adjacent
    [1, 1], [1, -1], [-1, 1], [-1, -1] // Diagonal
  ];
  
  for (const [dr, dc] of directions) {
    const row = entityRow + dr;
    const col = entityCol + dc;
    
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      const cell = cells.find(c => 
        parseInt(c.dataset.row) === row && 
        parseInt(c.dataset.col) === col
      );
      
      if (cell && !cell.classList.contains('occupied')) {
        return cell;
      }
    }
  }
  
  return null;
}

// Text-to-Speech
let ttsEnabled = false;

function toggleTTS() {
  ttsEnabled = !ttsEnabled;
  const btns = document.querySelectorAll('.btn');
  btns.forEach(btn => {
    if (btn.textContent.includes('TTS')) {
      btn.textContent = ttsEnabled ? '🔊 TTS ON' : '🔊 TTS';
      btn.style.background = ttsEnabled ? '#56ff9f' : '#0c3a23';
      btn.style.color = ttsEnabled ? '#000' : '#aef3c1';
    }
  });
}

// Calculate speech duration based on text length
function calculateSpeechDuration(text, rate = 1.0) {
  if (!text) return 2;
  
  // Average speaking rate: ~150 words per minute at rate=1.0
  // That's 2.5 words per second
  const wordCount = text.split(/\s+/).length;
  const baseSeconds = wordCount / (2.5 * rate);
  
  // Add 1-2 seconds buffer for natural pauses
  const buffer = Math.min(2, wordCount * 0.1);
  
  return Math.max(2, baseSeconds + buffer + 1);
}

function speakText(text, type) {
  if (!ttsEnabled || !text) {
    console.log('TTS skipped:', ttsEnabled ? 'no text' : 'disabled');
    return;
  }
  
  // Cancel any ongoing speech
  if (speechSynth.speaking) {
    speechSynth.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = playbackState.speed * 0.9;  // Slightly slower for clarity
  utterance.pitch = type === 'thinking' ? 0.9 : 1.1;
  utterance.volume = 1.0;  // Full volume
  
  const duration = calculateSpeechDuration(text, utterance.rate);
  console.log(`🔊 TTS: "${text.substring(0, 50)}..." (${duration.toFixed(1)}s at ${utterance.rate}x)`);
  
  utterance.onstart = () => console.log('▶ Speech started');
  utterance.onend = () => console.log('⏹ Speech ended');
  utterance.onerror = (e) => console.error('❌ Speech error:', e);
  
  speechSynth.speak(utterance);
}

// Cell Inspection
function inspectCell(row, col, symbol, elements) {
  const element = elements.find(el => 
    el.initial_grid_position.row === row + 1 && 
    el.initial_grid_position.col === col + 1
  );
  
  console.log(`Cell (${row}, ${col}):`, element || symbol);
  
  // Show inline inspector (simplified)
  alert(`Cell (${row}, ${col})\nSymbol: ${symbol}\nType: ${element?.type || 'Empty'}`);
}

// Corner Button System (inspired by thousand-tetrad)
function addCornerButtons() {
  // Remove any existing corner buttons
  document.querySelectorAll('.corner-btn, .corner-menu').forEach(el => el.remove());
  
  // Top-Left: Play/Pause
  const playBtn = createCornerButton('top-left', '▶', 'Play/Pause');
  playBtn.dataset.playing = 'false';
  playBtn.addEventListener('click', () => {
    playbackState.playing = !playbackState.playing;
    playBtn.textContent = playbackState.playing ? '⏸' : '▶';
    playBtn.dataset.playing = playbackState.playing;
    if (playbackState.playing) {
      startPlayback(currentSceneIndex);
    }
  });
  
  // Top-Right: Settings Menu
  const settingsBtn = createCornerButton('top-right', '⚙', 'Settings');
  const settingsMenu = createCornerMenu('top-right');
  
  // Speed control
  const speedControl = document.createElement('div');
  speedControl.innerHTML = `
    <div class="menu-label">SPEED</div>
    <div style="display: flex; gap: 8px;">
      <button class="menu-btn" onclick="changeSpeed(0.5)">0.5x</button>
      <button class="menu-btn" onclick="changeSpeed(1)">1x</button>
      <button class="menu-btn" onclick="changeSpeed(2)">2x</button>
      <button class="menu-btn" onclick="changeSpeed(4)">4x</button>
    </div>
  `;
  settingsMenu.appendChild(speedControl);
  
  // TTS Toggle
  const ttsToggle = document.createElement('button');
  ttsToggle.className = 'menu-btn';
  ttsToggle.innerHTML = `<div class="menu-label">TEXT-TO-SPEECH</div><div class="menu-value">OFF</div>`;
  ttsToggle.addEventListener('click', () => {
    toggleTTS();
    ttsToggle.querySelector('.menu-value').textContent = ttsEnabled ? 'ON' : 'OFF';
  });
  settingsMenu.appendChild(ttsToggle);
  
  // Emoji/Color Toggle
  const emojiToggle = document.createElement('button');
  emojiToggle.className = 'menu-btn';
  const useEmoji = localStorage.getItem('useEmoji') === 'true';
  emojiToggle.innerHTML = `<div class="menu-label">ENTITY DISPLAY</div><div class="menu-value">${useEmoji ? 'EMOJI' : 'COLOR'}</div>`;
  emojiToggle.addEventListener('click', () => {
    const current = localStorage.getItem('useEmoji') === 'true';
    localStorage.setItem('useEmoji', (!current).toString());
    emojiToggle.querySelector('.menu-value').textContent = !current ? 'EMOJI' : 'COLOR';
    // Refresh all panels to update display
    renderAllPanels();
    renderGlobalFooter();
  });
  settingsMenu.appendChild(emojiToggle);
  
  // Auto-Play Mode Toggle
  const autoPlayToggle = document.createElement('button');
  autoPlayToggle.className = 'menu-btn';
  autoPlayToggle.innerHTML = `<div class="menu-label">AUTO-PLAY MODE</div><div class="menu-value">OFF</div>`;
  autoPlayToggle.addEventListener('click', () => {
    playbackState.autoPlayMode = !playbackState.autoPlayMode;
    autoPlayToggle.querySelector('.menu-value').textContent = playbackState.autoPlayMode ? 'ON' : 'OFF';
    if (playbackState.autoPlayMode) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });
  settingsMenu.appendChild(autoPlayToggle);
  
  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('visible');
    closeOtherMenus(settingsMenu);
  });
  
  // Bottom-Left: Scene Info
  const infoBtn = createCornerButton('bottom-left', 'ℹ', 'Scene Info');
  const infoMenu = createCornerMenu('bottom-left');
  infoMenu.id = 'sceneInfoMenu';
  updateSceneInfo();
  
  infoBtn.addEventListener('click', () => {
    infoMenu.classList.toggle('visible');
    closeOtherMenus(infoMenu);
  });
  
  // Bottom-Right: Load Data
  const loadBtn = createCornerButton('bottom-right', '⊞', 'Load Data');
  loadBtn.addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });
  
  document.body.appendChild(playBtn);
  document.body.appendChild(settingsBtn);
  document.body.appendChild(settingsMenu);
  document.body.appendChild(infoBtn);
  document.body.appendChild(infoMenu);
  document.body.appendChild(loadBtn);
}

function createCornerButton(position, icon, title) {
  const btn = document.createElement('button');
  btn.className = `corner-btn ${position}`;
  btn.textContent = icon;
  btn.title = title;
  return btn;
}

function createCornerMenu(position) {
  const menu = document.createElement('div');
  menu.className = `corner-menu ${position}`;
  return menu;
}

function closeOtherMenus(exceptMenu) {
  document.querySelectorAll('.corner-menu').forEach(menu => {
    if (menu !== exceptMenu) {
      menu.classList.remove('visible');
    }
  });
}

function updateSceneInfo() {
  const menu = document.getElementById('sceneInfoMenu');
  if (!menu || !scenes[currentSceneIndex]) return;
  
  const scene = scenes[currentSceneIndex];
  menu.innerHTML = `
    <div class="menu-label">SCENE ${scene.number}</div>
    <div class="menu-value">${scene.title}</div>
    <div style="margin-top: 12px;">
      <div class="menu-label">DURATION</div>
      <div class="menu-value">${scene.duration}s</div>
    </div>
    <div style="margin-top: 12px;">
      <div class="menu-label">EVENTS</div>
      <div class="menu-value">${scene.timeline.length}</div>
    </div>
    <div style="margin-top: 12px;">
      <div class="menu-label">ELEMENTS</div>
      <div class="menu-value">${scene.elements.length}</div>
    </div>
  `;
}

// Global speed change function
window.changeSpeed = function(speed) {
  playbackState.speed = speed;
  document.querySelectorAll('.menu-btn').forEach(btn => {
    if (btn.textContent.includes('x')) {
      btn.style.background = btn.textContent === `${speed}x` ? '#56ff9f' : '#0c3a23';
      btn.style.color = btn.textContent === `${speed}x` ? '#000' : '#aef3c1';
    }
  });
};

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if (!scenes.length) return;
  
  switch(e.key) {
    case ' ':
      e.preventDefault();
      const playBtn = document.querySelector('.corner-btn.top-left');
      if (playBtn) playBtn.click();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      if (currentSceneIndex > 0) {
        navigateToScene(currentSceneIndex - 1);
      }
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (currentSceneIndex < scenes.length - 1) {
        navigateToScene(currentSceneIndex + 1);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      playbackState.speed = Math.min(4, playbackState.speed * 2);
      window.changeSpeed(playbackState.speed);
      break;
    case 'ArrowDown':
      e.preventDefault();
      playbackState.speed = Math.max(0.5, playbackState.speed / 2);
      window.changeSpeed(playbackState.speed);
      break;
    case 't':
    case 'T':
      toggleTTS();
      break;
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      const num = parseInt(e.key);
      if (num < scenes.length) {
        navigateToScene(num);
      }
      break;
    case 'Escape':
      document.querySelectorAll('.corner-menu').forEach(menu => {
        menu.classList.remove('visible');
      });
      break;
  }
});

// Detect scene changes on scroll
let scrollTimeout;
const container = document.getElementById('panelContainer');
if (container) {
  container.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      detectCurrentScene();
    }, 150);
  });
}

function detectCurrentScene() {
  const container = document.getElementById('panelContainer');
  const scrollLeft = container.scrollLeft;
  const panelWidth = window.innerWidth;
  const newIndex = Math.round(scrollLeft / panelWidth);
  
  if (newIndex !== currentSceneIndex && newIndex < scenes.length) {
    currentSceneIndex = newIndex;
    
    // Update scene selector
    const select = document.getElementById('globalSceneSelect');
    if (select) select.value = newIndex;
    
    // Update scene counter
    updateSceneCounter();
    
    // Update scene info
    updateSceneInfo();
    
    // Stop playback when changing scenes manually
    playbackState.playing = false;
    playbackState.currentTime = 0;
    const playBtn = document.querySelector('.corner-btn.top-left');
    if (playBtn) {
      playBtn.textContent = '▶';
      playBtn.dataset.playing = 'false';
    }
  }
}

// Auto-Play Mode - Plays all scenes sequentially
function startAutoPlay() {
  console.log('Auto-play mode activated');
  currentSceneIndex = 0;
  navigateToScene(0);
  playbackState.playing = true;
  
  // Update play button
  const playBtn = document.querySelector('.corner-btn.top-left');
  if (playBtn) {
    playBtn.textContent = '⏸';
    playBtn.dataset.playing = 'true';
  }
  
  // Start playback on first scene
  startPlayback(0);
  
  // Set up scene auto-advance
  playbackState.autoPlayInterval = setInterval(() => {
    if (!playbackState.autoPlayMode) {
      clearInterval(playbackState.autoPlayInterval);
      return;
    }
    
    const currentScene = scenes[currentSceneIndex];
    if (playbackState.currentTime >= currentScene.duration) {
      // Move to next scene
      if (currentSceneIndex < scenes.length - 1) {
        currentSceneIndex++;
        navigateToScene(currentSceneIndex);
        playbackState.currentTime = 0;
        playbackState.playing = true;
        startPlayback(currentSceneIndex);
      } else {
        // End of all scenes
        stopAutoPlay();
      }
    }
  }, 500);
}

function stopAutoPlay() {
  console.log('Auto-play mode deactivated');
  playbackState.autoPlayMode = false;
  if (playbackState.autoPlayInterval) {
    clearInterval(playbackState.autoPlayInterval);
    playbackState.autoPlayInterval = null;
  }
  playbackState.playing = false;
  
  // Update play button
  const playBtn = document.querySelector('.corner-btn.top-left');
  if (playBtn) {
    playBtn.textContent = '▶';
    playBtn.dataset.playing = 'false';
  }
}

console.log('Projection Viewer Core loaded. Ready to load data.');
console.log('Keyboard shortcuts: Space (play), ←/→ (scenes), ↑/↓ (speed), T (TTS), 0-9 (jump to scene)');
console.log('Click messages to highlight grid cells. Click grid cells to highlight messages.');
