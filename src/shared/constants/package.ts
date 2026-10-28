import {readFileSync} from 'fs';
import {join} from 'path';

export const PACKAGE_NAME = 'swagger-ui-cli';

// Resolved next to the bundle (dist/index.js), like PUBLIC_PATH
export const PACKAGE_VERSION: string = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf-8')).version;
