import { command } from 'execa'

import { LogHelper } from '@/helpers/log-helper'
import { SystemHelper } from '@/helpers/system-helper'

/**
 * Setup offline hotword detection
 */
export default () =>
  new Promise(async (resolve, reject) => {
    LogHelper.info('Setting up offline hotword detection...')

    const info = SystemHelper.getInformation()
    let pkgm = 'apt-get install'
    if (info.type === 'macos') {
      pkgm = 'brew'
    }

    if (info.type === 'windows') {
      LogHelper.error(
        'Offline hotword is not available on Windows. To regain hotword functionality: use macOS or Linux and run "npm run setup:offline-hotword", or run the hotword node in WSL2 Ubuntu.'
      )
      reject()
    } else {
      try {
        LogHelper.info('Installing dependencies...')

        let cmd = `sudo ${pkgm} sox libsox-fmt-all -y`
        if (info.type === 'linux') {
          LogHelper.info(`Executing the following command: ${cmd}`)
          await command(cmd, { shell: true })
        } else if (info.type === 'macos') {
          cmd = `${pkgm} install swig portaudio sox`
          LogHelper.info(`Executing the following command: ${cmd}`)
          await command(cmd, { shell: true })
        }

        LogHelper.success('System dependencies downloaded')
        LogHelper.info('Installing hotword dependencies...')
        await command('cd hotword && npm install', { shell: true })
        LogHelper.success('Offline hotword detection installed')
        await command(
          'cd hotword/node_modules/@bugsounet/snowboy && CXXFLAGS="--std=c++17" ../../../node_modules/@mapbox/node-pre-gyp/bin/node-pre-gyp clean configure build',
          { shell: true }
        )
        LogHelper.success('Snowboy bindings compiled')

        resolve()
      } catch (e) {
        LogHelper.error(
          'Failed to install offline hotword detection. Make sure SoX/PortAudio/swig are installed.\n' +
            '- Linux: sudo apt-get install sox libsox-fmt-all -y\n' +
            '- macOS: brew install swig portaudio sox\n' +
            'Then re-run: npm run setup:offline-hotword' 
        )
        LogHelper.error(String(e))
        reject(e)
      }
    }
  })
