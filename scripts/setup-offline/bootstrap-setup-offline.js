#!/usr/bin/env node
/*
  Bootstrap for offline setup: pre-check Node/npm engines and availability of tsx,
  then run the actual offline setup entry when ready.
*/

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const REQUIRED_NODE = '22.13.1'
const REQUIRED_NPM = '10.9.2'

function compareSemver(a, b) {
	const pa = a.replace(/^v/, '').split('.').map(Number)
	const pb = b.replace(/^v/, '').split('.').map(Number)
	for (let i = 0; i < 3; i++) {
		if ((pa[i] || 0) > (pb[i] || 0)) return 1
		if ((pa[i] || 0) < (pb[i] || 0)) return -1
	}
	return 0
}

function fail(msg) {
	console.error('\x1b[31m%s\x1b[0m', msg)
	process.exit(1)
}

function info(msg) {
	console.info('\x1b[36m%s\x1b[0m', msg)
}

// 1) Check Node.js version
const nodeVersion = process.version // e.g. v22.13.1
if (compareSemver(nodeVersion, REQUIRED_NODE) < 0) {
	fail(
		`Node.js ${REQUIRED_NODE}+ is required. Detected ${nodeVersion}.\n` +
		`Please upgrade Node (recommended via Volta) then retry:\n` +
		`  - Volta (Windows): https://volta.sh → volta install node@${REQUIRED_NODE}\n` +
		`  - Or install Node ${REQUIRED_NODE} from https://nodejs.org/ and open a new terminal.`
	)
}

// 2) Check npm version
const npmVersionResult = spawnSync('npm', ['-v'], { encoding: 'utf8' })
if (npmVersionResult.status !== 0) {
	fail('Failed to run "npm -v". Ensure npm is installed and in PATH.')
}
const npmVersion = (npmVersionResult.stdout || '').trim()
if (compareSemver(npmVersion, REQUIRED_NPM) < 0) {
	fail(
		`npm ${REQUIRED_NPM}+ is required. Detected ${npmVersion}.\n` +
		`Upgrade npm (Volta: volta install npm@${REQUIRED_NPM}) or reinstall Node ${REQUIRED_NODE}.`
	)
}

// 3) Check local tsx availability
const localTsx = process.platform === 'win32'
	? join(process.cwd(), 'node_modules', '.bin', 'tsx.cmd')
	: join(process.cwd(), 'node_modules', '.bin', 'tsx')

if (!existsSync(localTsx)) {
	fail(
		`Missing dev dependency "tsx" (not installed).\n` +
		`Run: npm install --no-fund --no-audit\n` +
		`Then re-run: npm run setup:offline`
	)
}

// 4) Run the actual offline setup via local tsx
info('Launching offline setup...')
const result = spawnSync(localTsx, ['scripts/setup-offline/setup-offline.js'], {
	stdio: 'inherit',
})

process.exit(result.status ?? 1)


