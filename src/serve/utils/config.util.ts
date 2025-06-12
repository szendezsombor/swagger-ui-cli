import {join} from 'path';
import {PUBLIC_PATH} from '../../public-path';
import {readFileSync} from 'fs';
import {existsSync, writeFileSync} from 'node:fs';
import {ServeConfig} from '../models';
import defaultConfig from '../../../public/swagger-ui.config';

export function handleConfigFileReplacement(config: string): void {
  const indexTsFile = join(PUBLIC_PATH, 'index.ts');
  const userConfigFile = join(process.cwd(), config);
  const outputConfigFile = existsSync(userConfigFile) ? userConfigFile : './swagger-ui.config.js';
  const res = readFileSync(indexTsFile, {encoding: 'utf-8'}).replace(
    /import config from '(?<path>.*)';/,
    `import config from '${outputConfigFile}';`,
  );
  return writeFileSync(indexTsFile, res, {encoding: 'utf-8'});
}

export async function getConfig(config: string): Promise<ServeConfig> {
  const userConfigFile = join(process.cwd(), config);
  const configFile = existsSync(userConfigFile) ? userConfigFile : defaultConfig;
  return typeof configFile === 'string' ? ((await import(configFile))['default'] as ServeConfig) : defaultConfig;
}
