const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

class STTDownloader {
  constructor() {
    this.baseUrl = 'https://github.com/coqui-ai/STT/releases/download';
    this.version = 'v1.4.0';
    this.platform = process.platform;
    this.arch = process.arch;
  }

  async downloadSTTFiles() {
    try {
      console.log('Checking for Coqui STT dependencies...');
      
      const requiredFiles = [
        'libstt.so',
        'stt.node',
        'coqui-stt.h',
        'libstt.dylib'
      ];

      const binDir = path.join(__dirname, '../../bin/coqui');
      
      // Create bin directory if it doesn't exist
      if (!fs.existsSync(binDir)) {
        fs.mkdirSync(binDir, { recursive: true });
      }

      let missingFiles = requiredFiles.filter(file => 
        !fs.existsSync(path.join(binDir, file))
      );

      if (missingFiles.length > 0) {
        console.log('Downloading missing Coqui STT files...');
        await this.downloadFromGitHub();
      } else {
        console.log('All Coqui STT files are present.');
      }

      // Download model files if missing
      await this.downloadModelFiles();

    } catch (error) {
      console.error('Error downloading STT files:', error);
      this.provideFallbackSolution();
    }
  }

  async downloadFromGitHub() {
    const assets = this.getPlatformAssets();
    
    for (const asset of assets) {
      const downloadUrl = `${this.baseUrl}/${this.version}/${asset.filename}`;
      const destination = path.join(__dirname, '../../bin/coqui', asset.filename);
      
      console.log(`Downloading ${asset.filename}...`);
      
      try {
        await this.downloadFile(downloadUrl, destination);
        console.log(`✓ Downloaded ${asset.filename}`);
        
        // Extract if it's a zip file
        if (asset.filename.endsWith('.zip')) {
          await this.extractZip(destination, path.dirname(destination));
        }
      } catch (error) {
        console.error(`Failed to download ${asset.filename}:`, error);
      }
    }
  }

  getPlatformAssets() {
    const assets = [];
    
    if (this.platform === 'win32' && this.arch === 'x64') {
      assets.push({
        filename: 'stt-1.4.0-windows-x64.zip',
        type: 'library'
      });
    } else if (this.platform === 'linux' && this.arch === 'x64') {
      assets.push({
        filename: 'stt-1.4.0-linux-x64.tar.gz',
        type: 'library'
      });
    } else if (this.platform === 'darwin') {
      assets.push({
        filename: 'stt-1.4.0-osx-x64.tar.gz',
        type: 'library'
      });
    }
    
    return assets;
  }

  async downloadModelFiles() {
    const modelFiles = [
      {
        url: 'https://github.com/coqui-ai/STT-models/releases/download/english%2Fcoqui%2Fv1.0.0-huge-vocab/huge-vocabulary.scorer',
        filename: 'huge-vocabulary.scorer'
      },
      {
        url: 'https://github.com/coqui-ai/STT-models/releases/download/english%2Fcoqui%2Fv1.0.0-huge-vocab/model.tflite',
        filename: 'model.tflite'
      }
    ];

    const modelDir = path.join(__dirname, '../../bin/coqui');
    
    for (const file of modelFiles) {
      const destination = path.join(modelDir, file.filename);
      
      if (!fs.existsSync(destination)) {
        console.log(`Downloading ${file.filename}...`);
        try {
          await this.downloadFile(file.url, destination);
          console.log(`✓ Downloaded ${file.filename}`);
        } catch (error) {
          console.error(`Failed to download ${file.filename}:`, error);
        }
      }
    }
  }

  downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);
      
      https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
          this.downloadFile(response.headers.location, destination)
            .then(resolve)
            .catch(reject);
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (error) => {
        fs.unlink(destination, () => {}); // Delete the file async
        reject(error);
      });
    });
  }

  extractZip(zipPath, extractTo) {
    return new Promise((resolve, reject) => {
      // You would need to implement zip extraction here
      // Using adm-zip or similar library
      console.log(`Extracting ${zipPath}...`);
      resolve();
    });
  }

  provideFallbackSolution() {
    console.log('\n=== MANUAL SETUP INSTRUCTIONS ===');
    console.log('1. Download Coqui STT binaries manually:');
    console.log('   Windows: https://github.com/coqui-ai/STT/releases/download/v1.4.0/stt-1.4.0-windows-x64.zip');
    console.log('2. Extract to: bin/coqui/ directory');
    console.log('3. Download model files:');
    console.log('   - https://github.com/coqui-ai/STT-models/releases/download/english%2Fcoqui%2Fv1.0.0-huge-vocab/huge-vocabulary.scorer');
    console.log('   - https://github.com/coqui-ai/STT-models/releases/download/english%2Fcoqui%2Fv1.0.0-huge-vocab/model.tflite');
    console.log('4. Place them in: bin/coqui/ directory');
    console.log('5. Run: npm run setup:offline-stt\n');
  }
}

// Run if this script is called directly
if (require.main === module) {
  const downloader = new STTDownloader();
  downloader.downloadSTTFiles().catch(console.error);
}

module.exports = STTDownloader;