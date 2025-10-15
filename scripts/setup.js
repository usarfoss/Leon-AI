const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const OSChecker = require('./check-os');

class SetupManager {
  constructor() {
    this.osChecker = new OSChecker();
  }

  async runFullSetup() {
    console.log('🚀 Starting Leon AI full setup...\n');

    try {
      // Step 1: Build project
      console.log('📦 Step 1: Building project...');
      this.runCommand('npm run build');

      // Step 2: Setup offline TTS
      console.log('\n🗣️  Step 2: Setting up offline TTS...');
      this.runCommand('npm run setup:offline-tts');

      // Step 3: Setup offline STT
      console.log('\n🎤 Step 3: Setting up offline STT...');
      this.runCommand('npm run setup:offline-stt');

      // Step 4: Setup hotword
      console.log('\n👂 Step 4: Setting up hotword detection...');
      this.runCommand('npm run setup:hotword');

      // Step 5: Verify setup
      console.log('\n✅ Step 5: Verifying setup...');
      this.runCommand('npm run check');

      console.log('\n🎉 Setup completed successfully!');
      console.log('💡 You can now start Leon with: npm start');

    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
      this.provideManualInstructions();
    }
  }

  runCommand(command) {
    try {
      execSync(command, { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Command failed: ${command}`);
    }
  }

  provideManualInstructions() {
    console.log('\n📋 MANUAL SETUP INSTRUCTIONS:');
    console.log('1. Build project: npm run build');
    console.log('2. Setup offline TTS: npm run setup:offline-tts');
    console.log('3. Setup offline STT: npm run setup:offline-stt');
    console.log('4. Setup hotword: npm run setup:hotword');
    console.log('5. Verify: npm run check');
    console.log('6. Start: npm start');
  }
}

// Run if this script is called directly
if (require.main === module) {
  const setupManager = new SetupManager();
  setupManager.runFullSetup().catch(console.error);
}

module.exports = SetupManager;