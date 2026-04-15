import {join, isAbsolute} from 'path';
import {PUBLIC_PATH} from '../../public-path';
import {existsSync, writeFileSync} from 'fs';
import {ServerConfig} from '../models';
import defaultConfig from '../../../public/swagger-ui.server-config';
import {resolveOpenapiSpec} from './resolve-openapi-spec.util';

export async function writeSpecFile(openApiSpecFilePathOrURL: string): Promise<void> {
  const specFile = join(PUBLIC_PATH, 'spec.txt');
  writeFileSync(specFile, await resolveOpenapiSpec(openApiSpecFilePathOrURL));
}

export async function getServerConfig(serverConfigPath: string): Promise<ServerConfig> {
  const userConfigFile = isAbsolute(serverConfigPath) ? serverConfigPath : join(process.cwd(), serverConfigPath);
  return existsSync(userConfigFile) ? ((await import(userConfigFile))['default'] as ServerConfig) : defaultConfig;
}
