let song, fft, space_between_lines;

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("music-visualizator");
  colorMode(HSB);
  filter(BLUR, 100);
  fft = new p5.FFT(0.9, 64);
  space_between_lines = (width/2) / 64;
}

function draw() {
  background(0);
  
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i++) {
    fill(i*3,255,255); //fill(i,255,255);
    let amp = spectrum[i];
    let y = map(amp, 0, 256, height, 350);
    rect((width/2) + (i * space_between_lines), y, space_between_lines, height - y);
    rect((width/2) - (i * space_between_lines), y, space_between_lines, height - y);
  }
}

// Chrome 70 will require user gestures to enable web audio api
// Click on the web page to start audio
function touchStarted() {
  getAudioContext().resume();
}