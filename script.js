let song;
let amplitude;
let particles = [];
let lastCurveUpdate = 0;
let bpm = 120;
let beatInterval = 60000 / bpm;
let lastBeat = 0;
let curvePoints = [];
let minCurveLength = 200;  // 最小曲線長度
let maxCurveLength = 200;  // 最大曲線長度
let minLineLength = 50;    // 最小直線長度
let maxLineLength = 200;   // 最大直線長度
let colors = [
  { r: 255, g: 0, b: 0 }    // #FF0000
];
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function updateColors() {
  let colorInputs = document.querySelectorAll('#colorInputs input[type="color"]');
  colors = Array.from(colorInputs).map(input => hexToRgb(input.value));
}

function updateBPM() {
  let newBPM = parseInt(document.getElementById('bpmInput').value);
  if (newBPM > 0 && newBPM <= 999) {
    bpm = newBPM;
    beatInterval = 60000 / bpm;
    document.getElementById('currentBPM').textContent = `Current BPM: ${bpm}`;
  }
}

function addColorInput() {
  let colorInputs = document.getElementById('colorInputs');
  let newColorInput = document.createElement('div');
  newColorInput.className = 'color-input';
  newColorInput.innerHTML = `<input type="color" value="#ff0000" onchange="updateColors()">`;
  colorInputs.appendChild(newColorInput);
  updateColors();
}

function removeColorInput() {
  let colorInputs = document.getElementById('colorInputs');
  if (colorInputs.children.length > 1) {
    colorInputs.removeChild(colorInputs.lastChild);
    updateColors();
  }
}

function handleAudioFile(event) {
  const file = event.target.files[0];
  if (file) {
    // Update selected file name display
    const selectedFileName = document.getElementById('selectedFileName');
    selectedFileName.textContent = file.name;

    // Check file type
    const fileType = file.type;
    let playButton = document.getElementById('playButton');
    let recordButton = document.getElementById('recordButton');

    if (fileType === 'audio/mpeg' || fileType === 'audio/wav') {
      // 停止當前播放的音樂（如果有的話）
      if (song && song.isPlaying()) {
        song.stop();
      }

      // 載入新的音樂文件
      loadSound(URL.createObjectURL(file), 
        // 成功載入回調
        function(loadedSound) {
          song = loadedSound;
          amplitude = new p5.Amplitude();
          playButton.disabled = false;
          playButton.textContent = 'Play';
          playButton.classList.remove('playing');
          recordButton.disabled = true;
        },
        // 載入失敗回調
        function(error) {
          console.error('Error loading sound file:', error);
          alert('Error loading sound file. Please try another file.');
        }
      );
    } else {
      alert('Only MP3 and WAV files are supported.');
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  amplitude = new p5.Amplitude();
  colorMode(RGB);
  strokeWeight(2);
  noFill();
}

function draw() {
  background(0, 25);

  if (song && song.isPlaying()) {
    let level = amplitude.getLevel();
    let size = map(level, 0, 1, 50, 400);

    // 根據BPM更新曲線點
    let currentTime = millis();
    if (currentTime - lastBeat >= beatInterval) {
      lastBeat = currentTime;
      updateCurvePoints(floor(random(3, 6)));
    }

    // 繪製所有曲線
    if (curvePoints.length >= 4) {
      for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        let offset = i * 10; // 每個顏色的偏移量

        stroke(color.r, color.g, color.b);
        beginShape();
        for (let j = 0; j < curvePoints.length; j++) {
          let point = curvePoints[j];
          let x = point.x + offset;
          let y = point.y + offset;

          // 根據音量添加抖動效果
          x += random(-level * 50, level * 50);
          y += random(-level * 50, level * 50);

          curveVertex(x, y);
        }
        endShape();
      }
    }

    // 更新和繪製粒子
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.display();
      if (p.isDead()) {
        particles.splice(i, 1);
      }
    }

    // 根據音量添加新粒子
    if (random(1) < level) {
      let x = random(width);
      let y = random(height);
      let color = random(colors);
      particles.push(new Particle(x, y, color));
    }
  }
}

function togglePlay() {
  let playButton = document.getElementById('playButton');
  let recordButton = document.getElementById('recordButton');

  // Resume audio context on first interaction
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }

  if (song.isPlaying()) {
    song.pause();
    playButton.textContent = 'Play';
    playButton.classList.remove('playing');
    recordButton.disabled = true;
  } else {
    song.play();
    playButton.textContent = 'Pause';
    playButton.classList.add('playing');
    recordButton.disabled = false;
  }
}

function toggleRecording() {
  let recordButton = document.getElementById('recordButton');

  if (!isRecording) {
    // 每次錄製時重新播放音樂
    song.stop();  // 先停止當前播放
    song.play();  // 從頭開始播放
    let playButton = document.getElementById('playButton');
    playButton.textContent = 'Pause';
    playButton.classList.add('playing');
    
    // 開始錄製
    recordedChunks = [];
    const stream = document.querySelector('canvas').captureStream(60); // 60 FPS
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 5000000 // 5Mbps
    });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'sound-vision-recording.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    };

    mediaRecorder.start(1000); // 每秒保存一次數據
    recordButton.textContent = 'Stop Recording';
    recordButton.classList.add('recording');
    isRecording = true;
  } else {
    // 停止錄製
    mediaRecorder.stop();
    recordButton.textContent = 'Start Recording';
    recordButton.classList.remove('recording');
    isRecording = false;
  }
}

function updateCurvePoints(count) {
  let currentTime = millis();
  if (currentTime - lastCurveUpdate < beatInterval) return;

  lastCurveUpdate = currentTime;
  curvePoints = [];

  // 添加起始點
  let x = random(width);
  let y = random(height);
  curvePoints.push({ x, y });

  // 生成中間點
  for (let i = 0; i < count; i++) {
    let angle = random(TWO_PI);
    let length = random(minLineLength, maxLineLength);
    x += cos(angle) * length;
    y += sin(angle) * length;

    // 確保點在畫布範圍內
    x = constrain(x, 0, width);
    y = constrain(y, 0, height);

    curvePoints.push({ x, y });
  }

  // 使曲線封閉
  curvePoints.push(curvePoints[0]);

  // 在起始和結束點重複添加點以實現平滑效果
  curvePoints.unshift(curvePoints[curvePoints.length - 2]);
  curvePoints.push(curvePoints[1]);
}

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.acc = createVector(0, 0);
    this.life = 255;
    this.color = color;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.life -= 5;
  }

  display() {
    stroke(this.color.r, this.color.g, this.color.b, this.life);
    point(this.pos.x, this.pos.y);
  }

  isDead() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
