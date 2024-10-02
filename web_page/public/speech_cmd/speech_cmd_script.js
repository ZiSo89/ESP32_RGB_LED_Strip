const socket = io.connect('http://192.168.1.8:8080');

let rgbColor = { r: 0, g: 0, b: 0 };
// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/yj1ptMJh4/"

async function createModel() {
  const checkpointURL = URL + "model.json"; // model topology
  const metadataURL = URL + "metadata.json"; // model metadata

  const recognizer = speechCommands.create(
    "BROWSER_FFT", // fourier transform type, not useful to change
    undefined, // speech commands vocabulary feature, not useful for your models
    checkpointURL,
    metadataURL);

  // check that model and metadata are loaded via HTTPS requests.
  await recognizer.ensureModelLoaded();

  return recognizer;
}

async function init() {
  const recognizer = await createModel();
  const classLabels = recognizer.wordLabels(); // get class labels
  const labelContainer = document.getElementById("label-container");
  for (let i = 0; i < classLabels.length; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }

  // listen() takes two arguments:
  // 1. A callback function that is invoked anytime a word is recognized.
  // 2. A configuration object with adjustable fields
  recognizer.listen(result => {
    const scores = result.scores; // probability of prediction for each class
    // render the probability scores per class
    for (let i = 0; i < classLabels.length; i++) {
      const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2);
      labelContainer.childNodes[i].innerHTML = classPrediction;
      let score = result.scores;
      if (classLabels[3] && score[3] >= 0.80) {
        rgbColor = { r: 255, g: 0, b: 0 };
        socket.emit('voice', rgbColor);
      }
      else if (classLabels[2] && score[2] >= 0.80) {
        rgbColor = { r: 0, g: 255, b: 0 };
        socket.emit('voice', rgbColor);
      }
      else if (classLabels[1] && score[1] >= 0.80) {
        rgbColor = { r: 0, g: 0, b: 255 };
        socket.emit('voice', rgbColor);
      }
    }

  }, {
    includeSpectrogram: true, // in case listen should return result.spectrogram
    probabilityThreshold: 0.75,
    invokeCallbackOnNoiseAndUnknown: true,
    overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
  });
  // Stop the recognition in 5 seconds.
  // setTimeout(() => recognizer.stopListening(), 5000);
}

init();