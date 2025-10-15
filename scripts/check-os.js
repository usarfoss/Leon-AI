import execa from 'execa'

import { LogHelper } from '@/helpers/log-helper'
import { SystemHelper } from '@/helpers/system-helper'

/**
 * Check OS environment
 */
export default () =>
  new Promise(async (resolve, reject) => {
    LogHelper.info('Checking OS environment...')

    const info = SystemHelper.getInformation()

    if (info.type === 'windows') {
      LogHelper.error('Voice offline mode is not available on Windows')
      reject()
    } else if (info.type === 'unknown') {
      LogHelper.error(
        'This OS is unknown, please open an issue to let us know about it'
      )
      reject()
    } else {
      try {
        LogHelper.success(`You are running ${info.name}`)
        LogHelper.info('Checking tools...')

        await execa('tar', ['--version'])
        LogHelper.success('"tar" found')
        await execa('make', ['--version'])
        LogHelper.success('"make" found')

        if (info.type === 'macos') {
          await execa('brew', ['--version'])
          LogHelper.success('"brew" found')
          await execa('curl', ['--version'])
          LogHelper.success('"curl" found')
        } else if (info.type === 'linux') {
          await execa('apt-get', ['--version'])
          LogHelper.success('"apt-get" found')
          await execa('wget', ['--version'])
          LogHelper.success('"wget" found')
        }

        resolve()
      } catch (e) {
        if (e.cmd) {
          const cmd = e.cmd.substr(0, e.cmd.indexOf(' '))
          LogHelper.error(
            `The following command has failed: "${e.cmd}". "${cmd}" is maybe missing. To continue this setup, please install the required tool. More details about the failure: ${e}`
          )
        } else {
          LogHelper.error(`Failed to prepare the environment: ${e}`)
        }

        reject(e)
      }
    }
  })

const os = require('os');
const path = require('path');
const fs = require('fs');

class OSChecker {
  constructor() {
    this.platform = os.platform();
    this.arch = os.arch();
    this.distro = this.getLinuxDistro();
  }

  getLinuxDistro() {
    if (this.platform !== 'linux') return null;
    
    try {
      const release = fs.readFileSync('/etc/os-release', 'utf8');
      const match = release.match(/PRETTY_NAME="(.+)"/);
      return match ? match[1] : 'Linux';
    } catch (error) {
      return 'Linux';
    }
  }

  getBinaryExtension() {
    return this.platform === 'win32' ? '.exe' : '';
  }

  getBinaryDirectory() {
    const baseDirs = {
      'python-bridge': 'bridges/python/dist',
      'tcp-server': 'tcp_server/dist'
    };

    // Platform and architecture specific subdirectories
    const platformMap = {
      'win32-x64': 'win-amd64',
      'linux-x64': 'linux-amd64',
      'darwin-x64': 'darwin-amd64',
      'darwin-arm64': 'darwin-arm64'
    };

    const key = `${this.platform}-${this.arch}`;
    const subdir = platformMap[key] || 'unknown';

    return {
      pythonBridge: path.join(baseDirs['python-bridge'], subdir),
      tcpServer: path.join(baseDirs['tcp-server'], subdir)
    };
  }

  getBinaryPaths() {
    const dirs = this.getBinaryDirectory();
    const ext = this.getBinaryExtension();

    return {
      pythonBridge: path.join(dirs.pythonBridge, `leon-python-bridge${ext}`),
      tcpServer: path.join(dirs.tcpServer, `leon-tcp-server${ext}`)
    };
  }

  checkBinaryPermissions(binaryPath) {
    if (this.platform === 'win32') {
      return true; // Windows doesn't have executable permissions in the same way
    }

    try {
      fs.accessSync(binaryPath, fs.constants.X_OK);
      return true;
    } catch (error) {
      try {
        fs.chmodSync(binaryPath, 0o755); // Make executable
        return true;
      } catch (chmodError) {
        return false;
      }
    }
  }

  verifyBinaries() {
    const paths = this.getBinaryPaths();
    const results = {};

    for (const [name, binaryPath] of Object.entries(paths)) {
      const exists = fs.existsSync(binaryPath);
      const isExecutable = exists ? this.checkBinaryPermissions(binaryPath) : false;
      
      results[name] = {
        path: binaryPath,
        exists,
        isExecutable,
        directory: path.dirname(binaryPath)
      };

      if (!exists) {
        console.error(`❌ Missing binary: ${name}`);
        console.error(`   Expected at: ${binaryPath}`);
      } else if (!isExecutable) {
        console.error(`❌ Binary not executable: ${name}`);
      }
    }

    return results;
  }

  setupBinaryDirectories() {
    const dirs = this.getBinaryDirectory();
    
    // Create directories if they don't exist
    Object.values(dirs).forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }
}

module.exports = OSChecker;

// Run if this script is called directly
if (require.main === module) {
  const checker = new OSChecker();
  console.log('Platform:', checker.platform);
  console.log('Architecture:', checker.arch);
  console.log('Distribution:', checker.distro);
  
  const binaryInfo = checker.verifyBinaries();
  console.log('Binary verification:', binaryInfo);
}