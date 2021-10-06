let song, amp, fft, space_between_lines;

function setup() {
  const canvas = createCanvas(600, 600);
  canvas.parent("music-visualizator");
  colorMode(HSB);
  fft = new p5.FFT(0.9, 64);
  amp = new p5.Amplitude();
  space_between_lines = width / 2 / 64;
}

function draw() {
  background(0);

  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length; i++) {
    fill(i * 3, 255, 255);
    let amp = spectrum[i] * 1.6;
    let y = map(amp, 0, 256, height, 350);
    rect(
      width / 2 + i * space_between_lines,
      y / 2,
      space_between_lines,
      height - y
    );
    rect(
      width / 2 - i * space_between_lines,
      y / 2,
      space_between_lines,
      height - y
    );
    push();
    fill(0);
    strokeWeight(3);
    line(0, height / 2, width, height / 2);
    pop();
  }
}

// Chrome 70 will require user gestures to enable web audio api
// Click on the web page to start audio
function touchStarted() {
  getAudioContext().resume();
}
