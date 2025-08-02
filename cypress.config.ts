import {defineConfig} from 'cypress';
import {execaNode, ResultPromise} from 'execa';
import {join} from 'path';
import {CliTaskArguments} from './cypress/shared/models';

const FIXTURES_DIR = join(process.cwd(), './cypress/fixtures');
const CLI_ENTRY_FILE = join(process.cwd(), './dist/index.js');
const CLI_WAIT_TIMEOUT = 10000;

const config = defineConfig({
  defaultBrowser: 'chrome',
  e2e: {
    setupNodeEvents(on, _config) {
      on('task', {
        cli,
        cliKill,
      });
    },
    env: {
      FIXTURES_DIR,
    },
  },
});

export default config;

// CLI Task related to cy.task('runCli') and cy.task('killCli')
let controller: AbortController | undefined;
let proc: ResultPromise | undefined;

function cli({command, specFile, flags}: CliTaskArguments): Promise<null> {
  return new Promise((resolve, reject) => {
    controller = new AbortController();
    proc = execaNode(CLI_ENTRY_FILE, [command, join(FIXTURES_DIR, specFile), ...(flags || [])], {
      reject: false,
      cancelSignal: controller.signal,
      stdio: 'pipe',
    });

    proc?.stdout?.on('data', (chunk: Buffer) => {
      if (command === 'serve' && chunk.toString().includes('Server is running on')) resolve(null);
    });

    setTimeout(() => {
      reject();
    }, CLI_WAIT_TIMEOUT);
  });
}

async function cliKill() {
  controller?.abort();
  return null;
}
