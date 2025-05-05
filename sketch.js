let mode = 0;
let splash;
let soundFile;
let fileInput;
let isSoundLoaded = false;
let instructions = "Load an audio file (WAV, MP3, OGG)";
let reverb;
let isLoaded = false;
let playButton, stopButton;
let volSlider;
let rateSlider;
let progressSlider;
let superBassFilter; 
let superBassToggle;
let superBassFreqSlider; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200);
  textAlign(LEFT, TOP);

  splash = new Splash();

  let currentY = 30;
  let spacing = 45;
  let sliderWidth = '180px';
  let labelX = 20;
  let controlX = 180; 

  fileInput = createFileInput(handleFile);
  fileInput.position(labelX, currentY);
  fileInput.hide();
  currentY += spacing;
  reverb = new p5.Reverb();


  playButton = createButton('Play');
  playButton.position(labelX, currentY);
  playButton.mousePressed(playAudio);
  playButton.attribute('disabled', '');
  playButton.hide();

  stopButton = createButton('Stop');
  stopButton.position(labelX + 60, currentY);
  stopButton.mousePressed(stopAudio);
  stopButton.attribute('disabled', '');
  stopButton.hide();
  currentY += spacing;

  progressSlider = createSlider(0, 1, 0, 0.01);
  progressSlider.position(labelX, currentY);
  progressSlider.style('width', '300px');
  progressSlider.input(seekAudio);
  progressSlider.attribute('disabled', '');
  progressSlider.hide();
  currentY += spacing;

  volSlider = createSlider(0, 1.5, 1, 0.01);
  volSlider.position(labelX, currentY);
  volSlider.style('width', sliderWidth);
  volSlider.input(updateVolume);
  volSlider.hide();
  currentY += spacing;

  rateSlider = createSlider(0.1, 2, 1, 0.01);
  rateSlider.position(labelX, currentY);
  rateSlider.style('width', sliderWidth);
  rateSlider.input(updateRate);
  rateSlider.hide();
  currentY += spacing + 10;

  superBassFilter = new p5.Filter('lowpass'); 
  superBassToggle = createCheckbox(' Super Bass Filter', false); 
  superBassToggle.position(labelX, currentY);
  superBassToggle.changed(applyEffectsChain);
  superBassToggle.hide();

  superBassFreqSlider = createSlider(20, 10000, 5000, 10);
  superBassFreqSlider.position(controlX, currentY);
  superBassFreqSlider.style('width', sliderWidth);
  superBassFreqSlider.input(applyEffectsChain);
  superBassFreqSlider.hide();
}

function draw() {
  if (mode === 0) {
    splash.display();
    if (mouseIsPressed === true && splash.update() === true) {
      mode = 1;
      splash.hide();
      showMainAppUI();
    }
  } else if (mode === 1) {
    background(150,250,150);
    fill(0);
    textSize(14);
    textAlign(LEFT, TOP);

    let currentY = 10;
    let spacing = 45;
    let labelX = 20;
    let valueX = 220;
    let controlX = 180;

    text("Load Audio File:", labelX, currentY);
    currentY += spacing;
    text("Playback:", labelX, currentY);
    currentY += spacing;
    text("Progress:", labelX, currentY);
    currentY += spacing;
    text("Volume:", labelX, currentY);
    text(volSlider.value().toFixed(2), valueX, currentY);
    currentY += spacing;
    text("Rate:", labelX, currentY);
    text(rateSlider.value().toFixed(2) + "x", valueX, currentY);
    currentY += spacing + 10;

    text("Effects:", labelX, currentY);
    currentY += spacing;
    

    text("Bass Focus Freq:", controlX, currentY);
    if (superBassToggle.checked()) { 
         text(superBassFreqSlider.value() + " Hz", controlX + 190, currentY);
    }
    
    if (isSoundLoaded && soundFile.isPlaying()) {
      if (!progressSlider.elt.matches(':active')) {
         progressSlider.value(soundFile.currentTime());
      }
    }
    
    fill(0);
  text(instructions, 10, 50);

  if (isLoaded) {
    text('Click canvas to Play/Stop sound.', 100, 700);
    text('Move mouse L/R to change Dry/Wet mix.', 100, 750);

    let dryWet = map(mouseX, 0, width, 0, 1);
    dryWet = constrain(dryWet, 0, 1);

    reverb.drywet(dryWet);

    text('Dry/Wet Mix: ' + round(dryWet * 100) + '%', 10, height - 30);
  } 


    textAlign(CENTER, BOTTOM);
    text(instructions, width / 2, height - 20);
  }
}


class Splash {
  constructor() { this.active = true; }
  update() { return this.active; }
  hide() { this.active = false; }
  display() {
    if (!this.active) return;
    background(0); fill(255); textAlign(CENTER, CENTER);
    textSize(32); text("Audio Manipulator", 150, 50);
    textSize(16); text("Yihang Cheng", width /2, height / 2 + 200);
    textSize(12); text("Welcome to the Audio Manipulator!" , width / 2, height / 2 - 20);
    textSize(12); text("Load your favorite sound file and dive into a world of sonic exploration." , width / 2, height / 2 -10);
    textSize(12); text("Play with effects, change the playback, and sculpt your audio in real-time. Click anywhere to begin your sound adventure!", width / 2, height / 2 );
    textSize(12); text("https://editor.p5js.org/chengjohnny625/sketches/9QcDhLc52", width / 2, height / 2 +10);
    
  }
}

function showMainAppUI() {
  fileInput.show();
  playButton.show();
  stopButton.show();
  progressSlider.show();
  volSlider.show();
  rateSlider.show();
  superBassToggle.show(); 
  superBassFreqSlider.show();
}


function handleFile(file) {
  if (file.type === 'audio') {
    if (soundFile) {
      soundFile.stop();
      soundFile.disconnect();
      superBassFilter.disconnect(); 
      reverb.disconnect(); 
    }
    isSoundLoaded = false;
    disablePlaybackControls();
    instructions = "Loading: " + file.name;
    soundFile = loadSound(file, soundLoadedCallback, soundLoadError);
  } else {
    instructions = "Please select an audio file (MP3, WAV, OGG).";
  }
    if (file.type === 'audio') {
    instructions = "Loading: " + file.name;
    isLoaded = false; 

  
    soundFile = loadSound(file, soundLoadedCallback, soundLoadError);

  } else {
    instructions = "Error: Please upload an audio file (MP3, WAV, OGG).";
    console.error("Uploaded file is not an audio type.");
  }

}

function soundLoadedCallback() {
  isLoaded = true;
  isSoundLoaded = true;
  instructions = "Loaded: " + soundFile.file.name;
  progressSlider.elt.max = soundFile.duration();
  progressSlider.value(0);
  enablePlaybackControls();
  updateVolume();
  updateRate();
  applyEffectsChain();
  reverb.process(soundFile, 3, 2); 
}

function soundLoadError(err) {
    console.error("Error loading sound file:", err);
    instructions = "Error loading sound. Check file format or try another.";
    isSoundLoaded = false;
    disablePlaybackControls();
}


function enablePlaybackControls() {
    playButton.removeAttribute('disabled');
    stopButton.removeAttribute('disabled');
    progressSlider.removeAttribute('disabled');
}

function disablePlaybackControls() {
    playButton.attribute('disabled', '');
    stopButton.attribute('disabled', '');
    progressSlider.attribute('disabled', '');
    progressSlider.value(0);
}


function playAudio() {
  if (isSoundLoaded && !soundFile.isPlaying()) soundFile.play();
}

function stopAudio() {
  if (isSoundLoaded) {
    soundFile.pause();
    //progressSlider.value(0);
  }
}

function seekAudio() {
  if (isSoundLoaded) soundFile.jump(progressSlider.value());
}

function updateVolume() {
  if (isSoundLoaded) soundFile.setVolume(volSlider.value());
}

function updateRate() {
  if (isSoundLoaded) soundFile.rate(rateSlider.value());
}

function applyEffectsChain() {
    if (!isSoundLoaded) return;

    let lastNode = soundFile;

    soundFile.disconnect();
    superBassFilter.disconnect(); 

    if (superBassToggle.checked()) { 
        superBassFilter.freq(superBassFreqSlider.value());
        lastNode.connect(superBassFilter); 
        lastNode = superBassFilter; 
    }

    lastNode.connect(); 
}