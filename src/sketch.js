let capture;
let detector;

let img;
let img2;
let img3;
let medio; // Definisci la variabile medio

const imgsize = 400;
let bgColor = 255; // colore di sfondo iniziale

function setup() {
  createCanvas(windowWidth, windowHeight); // dimensioni del canvas pari a quelle della finestra del browser

  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  console.log('Carico modello...');
  createDetector().then((res) => {
    detector = res;
    console.log('Modello caricato.');
  });
}

function preload() {
  img = loadImage('verde.png');
  img2 = loadImage('rosso.png');
  img3 = loadImage('azzurro.png');
}

function keyPressed() {
  if (key == 's') {
    medio = img2;
  } else if (key == 'd') {
    medio = img3;
  } else if (key == 'a') {
    medio = img;
  }
}

function draw() {
  background(bgColor); // colore di sfondo iniziale
  img.resize(imgsize, imgsize);
  img2.resize(imgsize, imgsize);
  img3.resize(imgsize, imgsize);

  if (detector && capture.loadedmetadata) {
    detector.estimateHands(capture.elt, {
      flipHorizontal: true
    }).then((hands) => {
      for (let j = 0; j < hands.length; j++) {
        const hand = hands[j];
        const handedness = hand.handedness; // Left : Right

        //   image(img, hand.keypoints[8].x, hand.keypoints[8].y); // disegna l'immagine base sulla mano

        if (medio) {
          image(medio, hand.keypoints[8].x, hand.keypoints[8].y); // disegna l'immagine corrente sulla mano
        }
      }
    });
  }
}

async function createDetector() {
  // Configurazione Media Pipe
  // https://google.github.io/mediapipe/solutions/hands
  const mediaPipeConfig = {
    runtime: 'mediapipe',
    modelType: 'full',
    maxHands: 2,
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`
  };
  return window.handPoseDetection.createDetector(
    window.handPoseDetection.SupportedModels.MediaPipeHands,
    mediaPipeConfig
  );
}

function mouseClicked() {
  bgColor = color(random(255), random(255), random(255)); // cambia colore di sfondo al click
}