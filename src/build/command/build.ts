import {build as viteBuild} from 'vite';
import {PUBLIC_PATH} from '../../public-path';
import {writeSpecFile, isOpenApiSpecPlaceValidUtil} from '../../serve';
import signale from 'signale';
import {BuildOptionsModel} from '../models';
import {join} from 'path';
import {existsSync} from 'fs';
import {viteSingleFile} from 'vite-plugin-singlefile';

export const build = async (openApiSpecFilePathOrURL: string, options: BuildOptionsModel) => {
  if (!(await isOpenApiSpecPlaceValidUtil(openApiSpecFilePathOrURL))) {
    signale.error('The OpenAPI file does not exist or the provided url is unreachable:', openApiSpecFilePathOrURL);
    return process.exit(1);
  }

  await writeSpecFile(openApiSpecFilePathOrURL);
  const userConfigFile = join(process.cwd(), options.config);

  await viteBuild({
    root: PUBLIC_PATH,
    plugins: options.multiFileBuild ? [] : [viteSingleFile()],
    resolve: {
      alias: {
        '@user-config': existsSync(userConfigFile) ? userConfigFile : join(PUBLIC_PATH, 'swagger-ui.config'),
      },
    },
    build: {
      outDir: join(process.cwd(), options.output),
    },
    optimizeDeps: {
      include: ['swagger-ui'],
    },
  });
};
