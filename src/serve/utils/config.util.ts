import {join} from 'path';
import {PUBLIC_PATH} from '../../public-path';
import {readFileSync} from 'fs';
import {existsSync, writeFileSync} from 'node:fs';

export function handleConfigFileReplacement(config: string): void {
  const indexTsFile = join(PUBLIC_PATH, 'index.ts');
  const userConfigFile = join(process.cwd(), config);
  const outputConfigFile = existsSync(userConfigFile) ? userConfigFile : './swagger-ui.conf';
  const res = readFileSync(indexTsFile, {encoding: 'utf-8'}).replace(
    /import config from '(?<path>.*)';/,
    `import config from '${outputConfigFile}';`,
  );
  return writeFileSync(indexTsFile, res, {encoding: 'utf-8'});
}
