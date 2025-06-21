import {build as viteBuild} from 'vite';
import {PUBLIC_PATH} from '../../public-path';
import {handleConfigFileReplacement, isOpenApiSpecPlaceValidUtil} from '../../serve';
import signale from 'signale';
import {BuildOptionsModel} from '../models';
import {join} from 'path';
import {viteSingleFile} from 'vite-plugin-singlefile';

export const build = async (openApiSpecFilePathOrURL: string, options: BuildOptionsModel) => {
  if (!(await isOpenApiSpecPlaceValidUtil(openApiSpecFilePathOrURL))) {
    signale.error('The OpenAPI file does not exist or the provided url is unreachable:', openApiSpecFilePathOrURL);
    return process.exit(1);
  }

  await handleConfigFileReplacement(options.config, openApiSpecFilePathOrURL);

  await viteBuild({
    root: PUBLIC_PATH,
    plugins: options.multiFileBuild ? [] : [viteSingleFile()],
    build: {
      outDir: join(process.cwd(), options.output),
    },
    optimizeDeps: {
      include: ['swagger-ui'],
    },
  });
};
