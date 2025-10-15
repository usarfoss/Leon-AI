import axios from 'axios'
import '@leon-ai/aurora/style.css'

window.leonInitStatusEvent = new EventTarget()

import './init'
import Client from './client'
// import Recorder from './recorder'
// import listener from './listener'
import { onkeydownstartrecording, onkeydowninput } from './onkeydown'

const config = {
  app: 'webapp',
  server_host: import.meta.env.VITE_LEON_HOST,
  server_port: import.meta.env.VITE_LEON_PORT,
  min_decibels: -40, // Noise detection sensitivity
  max_blank_time: 1_000 // Maximum time to consider a blank (ms)
}
const serverUrl =
  import.meta.env.VITE_LEON_NODE_ENV === 'production'
    ? ''
    : `${config.server_host}:${config.server_port}`

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/v1/info`)
    const input = document.querySelector('#utterance')
    const mic = document.querySelector('#mic-button')
    const v = document.querySelector('#version small')
    const infoButton = document.querySelector('#info')
    const client = new Client(config.app, serverUrl, input)
    // let rec = {}
    // let chunks = []

    window.leonConfigInfo = response.data
    const infoKeys = [
      'timeZone',
      'telemetry',
      'gpu',
      'graphicsComputeAPI',
      'totalVRAM',
      'freeVRAM',
      'usedVRAM',
      'llm',
      'shouldWarmUpLLMDuties',
      'isLLMActionRecognitionEnabled',
      'isLLMNLGEnabled',
      'stt',
      'tts',
      'mood',
      'version'
    ]
    const infoToDisplay = {}
    infoKeys.forEach((key) => {
      infoToDisplay[key] = window.leonConfigInfo[key]
    })

    v.textContent += window.leonConfigInfo.version

    client.updateMood(window.leonConfigInfo.mood)
    client.init()

    infoButton.addEventListener('click', () => {
      alert(JSON.stringify(infoToDisplay, null, 2))
    })

    /*if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (MediaRecorder) {
            rec = new Recorder(stream, mic, window.leonConfigInfo)
            client.recorder = rec

            rec.ondataavailable((e) => {
              chunks.push(e.data)
            })

            rec.onstart(() => {
              /!* *!/
            })

            rec.onstop(() => {
              const blob = new Blob(chunks)
              chunks = []
              rec.enabled = false

              // Ensure there are some data
              if (blob.size >= 1_000) {
                client.socket.emit('recognize', blob)
              }
            })

            listener.listening(
              stream,
              config.min_decibels,
              config.max_blank_time,
              () => {
                // Noise detected
                rec.noiseDetected = true
              },
              () => {
                // Noise ended

                rec.noiseDetected = false
                if (rec.enabled && !rec.hotwordTriggered) {
                  rec.stop()
                  rec.enabled = false
                  rec.hotwordTriggered = false
                  rec.countSilenceAfterTalk = 0
                }
              }
            )

            client.socket.on('enable-record', () => {
              rec.hotwordTriggered = true
              rec.start()
              setTimeout(() => {
                rec.hotwordTriggered = false
              }, config.max_blank_time)
              rec.enabled = true
            })
          } else {
            console.error('MediaRecorder is not supported on your browser.')
          }
        })
        .catch((err) => {
          console.error(
            'MediaDevices.getUserMedia() threw the following error:',
            err
          )
        })
    } else {
      console.error(
        'MediaDevices.getUserMedia() is not supported on your browser.'
      )
    }*/

    document.addEventListener('keydown', (e) => {
      onkeydownstartrecording(e, () => {
        client.asrStartRecording()
        /*if (rec.enabled === false) {
          input.value = ''
          rec.start()
          rec.enabled = true
        } else {
          rec.stop()
          rec.enabled = false
        }*/
      })
    })

    input.addEventListener('keydown', (e) => {
      onkeydowninput(e, client)
    })

    mic.addEventListener('click', (e) => {
      e.preventDefault()

      client.asrStartRecording()

      /*if (rec.enabled === false) {
        rec.start()
        rec.enabled = true
      } else {
        rec.stop()
        rec.enabled = false
      }*/
    })
  } catch (e) {
    alert(`Error: ${e.message}; ${JSON.stringify(e.response?.data)}`)
    console.error(e)
  }
})


// Hotword detection error handling
class HotwordDetection {
  constructor() {
    this.isListening = false;
    this.hotwordWorker = null;
    this.init();
  }

  async init() {
    try {
      // Check if hotword detection is supported
      if (!this.isHotwordSupported()) {
        this.showHotwordError('Hotword detection is not supported in your browser. Please use Chrome or Edge for full functionality.');
        return;
      }

      await this.loadHotwordModel();
      this.setupHotwordListener();
    } catch (error) {
      console.error('Hotword detection failed:', error);
      this.handleHotwordError(error);
    }
  }

  isHotwordSupported() {
    return typeof Worker !== 'undefined' && 
           typeof AudioContext !== 'undefined' &&
           typeof navigator.mediaDevices !== 'undefined';
  }

  async loadHotwordModel() {
    return new Promise((resolve, reject) => {
      // Check if hotword files exist
      fetch('/hotword/leon.pmdl')
        .then(response => {
          if (!response.ok) {
            throw new Error('Hotword model file not found');
          }
          resolve();
        })
        .catch(error => {
          reject(new Error('Hotword model missing. Please run: npm run setup:hotword'));
        });
    });
  }

  setupHotwordListener() {
    try {
      this.hotwordWorker = new Worker('/js/hotword-worker.js');

      this.hotwordWorker.onmessage = (e) => {
        if (e.data === 'hotword') {
          this.onHotwordDetected();
        }
      };

      this.hotwordWorker.onerror = (error) => {
        this.handleHotwordError(error);
      };

      this.startListening();
    } catch (error) {
      this.handleHotwordError(error);
    }
  }

  handleHotwordError(error) {
    console.error('Hotword detection error:', error);

    let errorMessage = 'Hotword detection temporarily unavailable. ';

    if (error.message.includes('model file not found') || 
        error.message.includes('Hotword model missing')) {
      errorMessage += 'Please run: npm run setup:hotword';
    } else if (error.message.includes('Microphone access denied')) {
      errorMessage += 'Please allow microphone access and refresh the page.';
    } else if (error.message.includes('not supported')) {
      errorMessage += 'Please use Chrome or Edge browser.';
    } else {
      errorMessage += 'Please refresh the page to try again.';
    }

    this.showHotwordError(errorMessage);
  }

  showHotwordError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'hotword-error';
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <strong>Hotword Issue</strong>
        <p style="margin: 8px 0 0 0; font-size: 14px;">${message}</p>
        <button onclick="this.parentElement.remove()" style="
          background: none;
          border: none;
          color: white;
          float: right;
          cursor: pointer;
          margin-top: 5px;
        ">×</button>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.isListening = true;
      // Initialize audio processing here
    } catch (error) {
      throw new Error('Microphone access denied: ' + error.message);
    }
  }

  onHotwordDetected() {
    // Handle hotword detection
    console.log('Hotword detected!');
    // Trigger voice listening mode
    this.activateVoiceMode();
  }

  activateVoiceMode() {
    document.getElementById('voice-overlay-bg').style.display = 'block';
    // Add your voice mode activation logic here
  }
}

// Initialize hotword detection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HotwordDetection();
});
