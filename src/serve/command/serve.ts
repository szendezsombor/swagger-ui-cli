import {createServer, CustomPayload, ViteDevServer} from 'vite';
import {ServeOptionsModel} from '../models';
import {readFileSync, copyFileSync} from 'fs';
import signale from 'signale';
import {PUBLIC_PATH} from '../../public-path';
import {getServerConfig, replaceClientConfigPath, isOpenApiSpecPlaceValidUtil} from '../utils';

export const serve = async (openApiSpecFilePathOrURL: string, options: ServeOptionsModel) => {
  if (!(await isOpenApiSpecPlaceValidUtil(openApiSpecFilePathOrURL))) {
    signale.error('The OpenAPI file does not exist or the provided url is unreachable:', openApiSpecFilePathOrURL);
    return process.exit(1);
  }

  await replaceClientConfigPath(options.config, openApiSpecFilePathOrURL);
  const serverConfig = await getServerConfig(options.serverConfig);
  const devServer = await createServer({
    ...serverConfig,
    root: PUBLIC_PATH,
    optimizeDeps: {
      ...serverConfig.optimizeDeps,
      include: [...(serverConfig.optimizeDeps?.include || []), 'swagger-ui'],
    },
    server: {
      host: options.domain,
      port: options.port,
      allowedHosts: [options.domain],
      ...(serverConfig.server || {}),
    },
    plugins: [
      ...(serverConfig.plugins || []),
      {
        name: 'openapi-file-watch',
        configureServer({ws, watcher}: ViteDevServer) {
          // Add the OpenAPI to watcher, for live updates
          watcher.add(openApiSpecFilePathOrURL);

          const specFileName = openApiSpecFilePathOrURL.split('/').pop() || 'openapi.yaml';

          // Watch for changes to the OpenAPI file and send updates to the client
          watcher.on('change', (file: string) => {
            if (file.endsWith(specFileName)) {
              ws.send({
                type: 'custom',
                event: 'openapi-watch',
                data: readFileSync(file, {encoding: 'utf-8'}),
              } as CustomPayload);
              copyFileSync(file, openApiSpecFilePathOrURL);
            }
          });
        },
      },
    ],
  });

  await devServer.listen();

  process.on('SIGINT', () => {
    devServer.close();
    process.exit(0);
  });

  const startedPort = devServer.config.server.port;
  if (startedPort !== options.port && startedPort !== serverConfig.server?.port)
    signale.warn(`Port already in use: ${options.port}. Using port: ${startedPort} instead.`);

  signale.success(`Server is running on http://${options.domain}:${devServer.config.server.port}`);
};
