/**
 * This file allows to run a separate node to detect the wake word "Leon/Léon"
 * You can consider to run this file on a different hardware
 */

const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { io } = require('socket.io-client')

// Preflight: clearly fail fast on unsupported platforms and missing native deps
const isWindows = process.platform === 'win32'
if (isWindows) {
  console.error(
    'Offline hotword is not available on Windows. To regain hotword functionality:\n' +
      '- Use macOS or Linux, then run "npm run setup:offline-hotword"\n' +
      '- Or use WSL2 Ubuntu for the hotword node (then run the setup inside WSL)\n' +
      '- Or skip offline hotword and trigger Leon from the UI microphone'
  )
  process.exit(1)
}

let record
let Detector
let Models
try {
  // node-record-lpcm16 depends on system audio stack (SoX/PortAudio)
  record = require('node-record-lpcm16')
  ;({ Detector, Models } = require('@bugsounet/snowboy'))
} catch (err) {
  console.error(
    'Failed to load native hotword dependencies. To fix:\n' +
      '- Ensure system deps are installed (Linux: sudo apt-get install sox libsox-fmt-all -y)\n' +
      '- On macOS: brew install swig portaudio sox\n' +
      '- Then run: npm run setup:offline-hotword\n' +
      `Error details: ${err}`
  )
  process.exit(1)
}

process.env.LEON_HOST = process.env.LEON_HOST || 'http://localhost'
process.env.LEON_PORT = process.env.LEON_PORT || 1337
const url = `${process.env.LEON_HOST}:${process.env.LEON_PORT}`
const socket = io(url)
const { argv } = process
const lang = argv[2] || 'en'

socket.on('connect', () => {
  socket.emit('init', 'hotword-node')
  console.log('Language:', lang)
  console.log('Connected to the server')
  console.log('Waiting for hotword...')
})
;(async () => {
  try {
    await axios.get(`${url}/api/v1/info`)

    const models = new Models()

    models.add({
      file: `${__dirname}/models/leon-${lang}.pmdl`,
      sensitivity: '0.5',
      hotwords: `leon-${lang}`
    })

    const resourcePath = path.join(
      __dirname,
      'node_modules',
      '@bugsounet',
      'snowboy',
      'resources',
      'common.res'
    )

    const modelPath = `${__dirname}/models/leon-${lang}.pmdl`
    if (!fs.existsSync(modelPath)) {
      console.error(
        `Hotword model not found at ${modelPath}. Make sure you selected a supported language and the model files are present. Try re-running: npm run setup:offline-hotword`
      )
      process.exit(1)
    }

    if (!fs.existsSync(resourcePath)) {
      console.error(
        'Snowboy resources are missing. Try re-running: npm run setup:offline-hotword'
      )
      process.exit(1)
    }

    const detector = new Detector({
      resource: resourcePath,
      models,
      audioGain: 2.0,
      applyFrontend: true
    })

    /*detector.on('silence', () => {
      })*/

    detector.on('sound', (/* buffer */) => {
      /**
       * <buffer> contains the last chunk of the audio that triggers the "sound" event.
       * It could be written to a wav stream
       */
    })

    detector.on('error', () => {
      console.error('error')
    })

    detector.on('hotword', (index, hotword, buffer) => {
      /**
       * <buffer> contains the last chunk of the audio that triggers the "hotword" event.
       * It could be written to a wav stream. You will have to use it
       * together with the <buffer> in the "sound" event if you want to get audio
       * data after the hotword
       */
      const obj = { hotword, buffer }

      console.log('Hotword detected', obj)
      socket.emit('hotword-detected', obj)
    })

    const mic = record.start({
      threshold: 0,
      verbose: false
    })

    mic.pipe(detector)
  } catch (e) {
    if (!e.response) {
      console.error(`Failed to reach the server: ${e}`)
    } else {
      console.error(e)
    }
  }
})()
