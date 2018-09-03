// imports
const record = require("node-record-lpcm16");
const speech = require("@google-cloud/speech");

// client & request to send to Google's Speech-To-Text API
const client = new speech.SpeechClient();
const request = {
  config: {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US"
  },
  interimResults: true
};

// stream that sends audio input to the Speech API
const recognizeStream = client
  .streamingRecognize(request)
  .on("error", console.error)
  .on("data", data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  );

// start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz: request.config.sampleRateHertz,
    threshold: 0,
    verbose: false,
    recordProgram: "rec",
    silence: "10.0"
  })
  .on("error", console.error)
  .pipe(recognizeStream);

console.log("Listening, press Ctrl+C to stop.");
