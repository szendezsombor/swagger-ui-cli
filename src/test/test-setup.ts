import 'cli-testing-library/jest';
import {existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {toMatchImageSnapshot} from 'jest-image-snapshot';
import {fileURLToPath} from 'node:url';

expect.extend({toMatchImageSnapshot});
const __dirname = dirname(fileURLToPath(import.meta.url));

process.env.SNAPSHOTS_DIR = join(__dirname, '../../snapshots');
process.env.DIST_INDEX_JS = join(__dirname, '../../dist/index.js');
process.env.OPENAPI_FILE_FOLDER = join(__dirname, './openapi.yaml');

describe('the project', () => {
  it('should be build before all other test start (run npm run build)', () => {
    expect(existsSync(process.env.DIST_INDEX_JS)).toBe(true);
  });
});
