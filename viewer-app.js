let data = null;
let currentSceneIndex = 0;
let currentTime = 0;
let isPlaying = false;
let playbackSpeed = 1;
let animationFrame = null;
let lastTimestamp = 0;
let particles = [];
let movingElements = new Map();

const SPRITES = {
  officer: '👮',
  clancy: '🧑',
  scholar: '🎓',
  apparatus: '⚙️',
  'filing-cabinet': '🗄️',
  keyboard: '⌨️',
  cylinder: '🔩',
  belt: '➡️',
  booth: '🚪',
  camera: '📹'
};

// Load data
async function loadData() {
  try {
    const response = await fetch('disc-data.json');
    data = await response.json();
    document.getElementById('loading').style.display = 'none';
    document.getElementById('viewer').style.display = 'grid';
    document.getElementById('controls').style.display = 'flex';
    initializeViewer();
  } catch (error) {
    document.getElementById('loading').textContent = 'Error Loading Data';
    console.error('Failed to load data:', error);
  }
}

function initializeViewer() {
  const sceneSelect = document.getElementById('scene-select');
  data.scenes.forEach((scene, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Scene ${scene.scene_number}: ${scene.title.substring(0, 40)}`;
    sceneSelect.appendChild(option);
  });

  sceneSelect.addEventListener('change', (e) => {
    currentSceneIndex = parseInt(e.target.value);
    currentTime = 0;
    updateAllViews();
  });

  document.getElementById('time-slider').addEventListener('input', (e) => {
    const scene = data.scenes[currentSceneIndex];
    currentTime = (parseFloat(e.target.value) / 100) * scene.metadata.scene_duration_seconds;
    updateAllViews();
  });

  document.getElementById('play-button').addEventListener('click', togglePlayback);
  document.getElementById('speed-select').addEventListener('change', (e) => {
    playbackSpeed = parseFloat(e.target.value);
  });

  document.getElementById('timeline-scrubber').addEventListener('click', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const scene = data.scenes[currentSceneIndex];
    currentTime = percent * scene.metadata.scene_duration_seconds;
    updateAllViews();
  });

  updateAllViews();
}

function updateAllViews() {
  const scene = data.scenes[currentSceneIndex];
  renderGrid(scene);
  renderTimeline(scene);
  renderPowerDistribution(scene);
  
  document.getElementById('time-display').textContent = `${currentTime.toFixed(1)}s`;
  const timePercent = (currentTime / scene.metadata.scene_duration_seconds) * 100;
  document.getElementById('time-slider').value = timePercent;
  document.getElementById('playhead').style.left = `${timePercent}%`;
  document.getElementById('scene-info').textContent = scene.subtitle;
  
  processEvents(scene);
}

function renderGrid(scene) {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';
  const layout = scene.initial_grid_layout;
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = row + 1;
      cell.dataset.col = col + 1;
      
      const coords = document.createElement('div');
      coords.className = 'grid-cell-coords';
      coords.textContent = `${row + 1},${col + 1}`;
      cell.appendChild(coords);
      
      const symbol = layout[row][col];
      if (symbol) {
        cell.classList.add('occupied');
        cell.setAttribute('data-symbol', symbol);
        const textNode = document.createTextNode(symbol);
        cell.appendChild(textNode);
        
        const element = scene.elements_in_scene.find(el => 
          el.initial_grid_position && 
          el.initial_grid_position.row === row + 1 && 
          el.initial_grid_position.col === col + 1
        );
        
        if (element) {
          const type = element.type.toLowerCase();
          let spriteKey = 'apparatus';
          
          if (type.includes('officer')) {
            cell.classList.add('officer');
            spriteKey = 'officer';
          } else if (type.includes('clancy')) {
            cell.classList.add('clancy');
            spriteKey = 'clancy';
          } else if (type.includes('scholar')) {
            cell.classList.add('scholar');
            spriteKey = 'scholar';
          } else if (type.includes('apparatus') || type.includes('cylinder') || 
                     type.includes('belt') || type.includes('keyboard')) {
            cell.classList.add('apparatus');
            if (type.includes('keyboard')) spriteKey = 'keyboard';
            else if (type.includes('cylinder')) spriteKey = 'cylinder';
            else if (type.includes('belt')) spriteKey = 'belt';
          } else if (type.includes('filing')) {
            cell.classList.add('filing-cabinet');
            spriteKey = 'filing-cabinet';
          } else if (type.includes('booth')) {
            spriteKey = 'booth';
          } else if (type.includes('camera')) {
            spriteKey = 'camera';
          }
          
          cell.dataset.elementId = element.id;
          cell.dataset.sprite = SPRITES[spriteKey] || '◆';
          
          if (Math.random() > 0.7) {
            spawnParticle(col * 48 + 24, row * 48 + 24, cell.style.color || '#0f0');
          }
        }
      }
      
      cell.addEventListener('click', () => inspectCell(cell, scene));
      container.appendChild(cell);
    }
  }
}

function renderTimeline(scene) {
  const track = document.getElementById('timeline-track');
  const list = document.getElementById('event-list');
  
  track.innerHTML = '';
  list.innerHTML = '';
  
  const duration = scene.metadata.scene_duration_seconds;
  
  scene.animation_timeline.forEach((event, index) => {
    const eventBar = document.createElement('div');
    eventBar.className = `timeline-event ${event.type}`;
    const startPercent = (event.delay_seconds / duration) * 100;
    const widthPercent = ((event.duration_seconds || 0.5) / duration) * 100;
    eventBar.style.left = `${startPercent}%`;
    eventBar.style.width = `${widthPercent}%`;
    eventBar.title = `${event.type} @ ${event.delay_seconds}s`;
    eventBar.addEventListener('click', () => {
      currentTime = event.delay_seconds;
      updateAllViews();
    });
    track.appendChild(eventBar);
    
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    if (currentTime >= event.delay_seconds && 
        currentTime < event.delay_seconds + (event.duration_seconds || 0)) {
      eventItem.classList.add('active');
    }
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'event-time';
    timeSpan.textContent = `${event.delay_seconds.toFixed(1)}s`;
    
    const typeSpan = document.createElement('span');
    typeSpan.className = `event-type ${event.type}`;
    typeSpan.textContent = event.type;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = event.text || event.notes || event.target_element_id || '';
    
    eventItem.appendChild(timeSpan);
    eventItem.appendChild(typeSpan);
    eventItem.appendChild(textSpan);
    
    eventItem.addEventListener('click', () => {
      currentTime = event.delay_seconds;
      updateAllViews();
      inspectEvent(event);
    });
    
    list.appendChild(eventItem);
  });
}

function renderPowerDistribution(scene) {
  const container = document.getElementById('power-bars');
  container.innerHTML = '';
  
  if (scene.power_distribution) {
    Object.entries(scene.power_distribution).forEach(([key, value]) => {
      const item = document.createElement('div');
      item.className = 'power-bar-item';
      
      const label = document.createElement('div');
      label.className = 'power-bar-label';
      
      const name = document.createElement('span');
      name.textContent = key.toUpperCase();
      
      const desc = document.createElement('span');
      desc.style.color = '#666';
      desc.style.fontSize = '9px';
      desc.textContent = value.description || '';
      
      label.appendChild(name);
      label.appendChild(desc);
      
      const track = document.createElement('div');
      track.className = 'power-bar-track';
      
      const fill = document.createElement('div');
      fill.className = 'power-bar-fill';
      
      let score = 0;
      if (typeof value.score === 'number') {
        score = value.score;
      } else if (value.score_range) {
        score = (value.score_range[0] + value.score_range[1]) / 2;
      }
      
      fill.style.width = `${score * 100}%`;
      fill.textContent = `${(score * 100).toFixed(0)}%`;
      
      track.appendChild(fill);
      item.appendChild(label);
      item.appendChild(track);
      container.appendChild(item);
    });
  }
  
  const metaGrid = document.getElementById('metadata-grid');
  metaGrid.innerHTML = '';
  
  const metadata = scene.metadata;
  
  const metaItems = [
    { label: 'Duration', value: `${metadata.scene_duration_seconds}s` },
    { label: 'Apparatus Level', value: `${(metadata.apparatus_operation_level * 100).toFixed(0)}%` },
    { label: 'Procession', value: metadata.procession_formation },
    { label: 'Margin Visibility', value: `${(metadata.margin_visibility * 100).toFixed(0)}%` }
  ];
  
  metaItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'metadata-card';
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'metadata-label';
    labelDiv.textContent = item.label;
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'metadata-value';
    valueDiv.textContent = item.value;
    
    card.appendChild(labelDiv);
    card.appendChild(valueDiv);
    metaGrid.appendChild(card);
  });
}

function processEvents(scene) {
  const bubbleContainer = document.getElementById('bubble-overlay');
  bubbleContainer.innerHTML = '';
  
  const activeEvents = scene.animation_timeline.filter(event => {
    return currentTime >= event.delay_seconds && 
           currentTime < event.delay_seconds + (event.duration_seconds || 0);
  });
  
  activeEvents.forEach((event, index) => {
    if ((event.type === 'thinking_bubble' || event.type === 'speech_bubble') && event.text) {
      const bubble = document.createElement('div');
      bubble.className = `bubble ${event.display_type}`;
      bubble.textContent = event.text;
      
      const tail = document.createElement('div');
      tail.className = 'bubble-tail';
      bubble.appendChild(tail);
      
      bubble.style.left = `${20 + index * 270}px`;
      bubble.style.top = `${100 + index * 80}px`;
      
      bubbleContainer.appendChild(bubble);
    }
    
    if (event.type === 'move_element' && event.target_element_id) {
      handleMovement(event);
    }
    
    if (event.type === 'visual_effect') {
      handleVisualEffect(event);
    }
  });
  
  updateParticles();
  renderParticles();
}

function handleMovement(event) {
  const key = event.target_element_id;
  if (!movingElements.has(key)) {
    const progress = (currentTime - event.delay_seconds) / (event.duration_seconds || 1);
    if (progress >= 0 && progress <= 1) {
      const start = event.start_position;
      const end = event.end_position;
      const currentRow = Math.round(start.row + (end.row - start.row) * progress);
      const currentCol = Math.round(start.col + (end.col - start.col) * progress);
      
      movingElements.set(key, { row: currentRow, col: currentCol });
      
      if (Math.random() > 0.5) {
        const gridContainer = document.querySelector('.grid-container');
        const rect = gridContainer?.getBoundingClientRect();
        if (rect) {
          spawnParticle(
            rect.left + currentCol * 48,
            rect.top + currentRow * 48,
            '#0ff'
          );
        }
      }
    }
  }
}

function handleVisualEffect(event) {
  if (event.effect_type === 'pulse' || event.effect_type === 'rotate') {
    const gridContainer = document.querySelector('.grid-container');
    if (gridContainer && Math.random() > 0.8) {
      const rect = gridContainer.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        spawnParticle(
          rect.left + Math.random() * rect.width,
          rect.top + Math.random() * rect.height,
          event.color || '#0f0'
        );
      }
    }
  }
}

function spawnParticle(x, y, color) {
  particles.push({
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2 - 1,
    life: 1.0,
    color: color,
    char: ['•', '·', '∘', '○', '◦'][Math.floor(Math.random() * 5)]
  });
}

function updateParticles() {
  particles = particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 0.02;
    return p.life > 0;
  });
}

function renderParticles() {
  let container = document.getElementById('particle-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'particle-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:60;font-family:monospace;';
    document.body.appendChild(container);
  }
  
  container.innerHTML = '';
  particles.forEach(p => {
    const el = document.createElement('div');
    el.textContent = p.char;
    el.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;color:${p.color};opacity:${p.life};font-size:${12 + p.life * 8}px;text-shadow:0 0 ${p.life * 10}px currentColor;transition:all 0.1s;`;
    container.appendChild(el);
  });
}

function inspectCell(cell, scene) {
  const elementId = cell.dataset.elementId;
  if (!elementId) return;
  
  const element = scene.elements_in_scene.find(el => el.id === elementId);
  if (!element) return;
  
  const container = document.getElementById('inspector-content');
  container.innerHTML = '';
  
  const section = document.createElement('div');
  section.className = 'inspector-section';
  
  const title = document.createElement('div');
  title.className = 'inspector-title';
  title.textContent = `${element.type} - ${element.id}`;
  
  const jsonViewer = document.createElement('div');
  jsonViewer.className = 'json-viewer';
  jsonViewer.innerHTML = syntaxHighlight(JSON.stringify(element, null, 2));
  
  section.appendChild(title);
  section.appendChild(jsonViewer);
  container.appendChild(section);
}

function inspectEvent(event) {
  const container = document.getElementById('inspector-content');
  container.innerHTML = '';
  
  const section = document.createElement('div');
  section.className = 'inspector-section';
  
  const title = document.createElement('div');
  title.className = 'inspector-title';
  title.textContent = `Event: ${event.type}`;
  
  const jsonViewer = document.createElement('div');
  jsonViewer.className = 'json-viewer';
  jsonViewer.innerHTML = syntaxHighlight(JSON.stringify(event, null, 2));
  
  section.appendChild(title);
  section.appendChild(jsonViewer);
  container.appendChild(section);
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

function togglePlayback() {
  isPlaying = !isPlaying;
  const button = document.getElementById('play-button');
  
  if (isPlaying) {
    button.textContent = 'Pause';
    button.classList.add('playing');
    lastTimestamp = performance.now();
    animationFrame = requestAnimationFrame(animate);
  } else {
    button.textContent = 'Play';
    button.classList.remove('playing');
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }
}

function animate(timestamp) {
  if (!isPlaying) return;
  
  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;
  
  const scene = data.scenes[currentSceneIndex];
  currentTime += deltaTime * playbackSpeed;
  
  if (currentTime >= scene.metadata.scene_duration_seconds) {
    currentTime = 0;
    if (currentSceneIndex < data.scenes.length - 1) {
      currentSceneIndex++;
      document.getElementById('scene-select').value = currentSceneIndex;
    } else {
      isPlaying = false;
      document.getElementById('play-button').textContent = 'Play';
      document.getElementById('play-button').classList.remove('playing');
      return;
    }
  }
  
  updateAllViews();
  animationFrame = requestAnimationFrame(animate);
}

setInterval(() => {
  if (isPlaying) {
    const gridCells = document.querySelectorAll('.grid-cell.occupied');
    if (gridCells.length > 0 && Math.random() > 0.7) {
      const randomCell = gridCells[Math.floor(Math.random() * gridCells.length)];
      const rect = randomCell.getBoundingClientRect();
      spawnParticle(rect.left + rect.width / 2, rect.top + rect.height / 2, randomCell.style.color || '#0f0');
    }
  }
}, 500);

setInterval(() => {
  if (!isPlaying) {
    updateParticles();
    renderParticles();
  }
}, 50);


loadData();
