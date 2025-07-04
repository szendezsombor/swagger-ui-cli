import {join, isAbsolute} from 'path';
import {PUBLIC_PATH} from '../../public-path';
import {existsSync, writeFileSync, readFileSync} from 'fs';
import {ServerConfig} from '../models';
import defaultConfig from '../../../public/swagger-ui.server-config';
import {resolveOpenapiSpec} from './resolve-openapi-spec.util';

export async function replaceClientConfigPath(clientConfigPath: string, openApiSpecFilePathOrURL: string): Promise<void> {
  const specFile = join(PUBLIC_PATH, 'spec.txt');
  const indexTsFile = join(PUBLIC_PATH, 'index.ts');
  const userConfigFile = join(process.cwd(), clientConfigPath);
  const outputConfigFile = existsSync(userConfigFile) ? userConfigFile : './swagger-ui.config';
  const res = readFileSync(indexTsFile, {encoding: 'utf-8'}).replace(
    /import config from '(?<path>.*)';/,
    `import config from '${outputConfigFile}';`,
  );
  writeFileSync(specFile, await resolveOpenapiSpec(openApiSpecFilePathOrURL));
  return writeFileSync(indexTsFile, res, {encoding: 'utf-8'});
}

export async function getServerConfig(serverConfigPath: string): Promise<ServerConfig> {
  const userConfigFile = isAbsolute(serverConfigPath) ? serverConfigPath : join(process.cwd(), serverConfigPath);
  return existsSync(userConfigFile) ? ((await import(userConfigFile))['default'] as ServerConfig) : defaultConfig;
}
