import {createServer, CustomPayload, ViteDevServer} from 'vite';
import {ServeOptionsModel} from '../models';
import {readFileSync, copyFileSync, existsSync} from 'fs';
import signale from 'signale';
import {PUBLIC_PATH} from '../../public-path';
import {getServerConfig, writeSpecFile, isOpenApiSpecPlaceValidUtil} from '../utils';
import {join} from 'node:path';

export const serve = async (openApiSpecFilePathOrURL: string, options: ServeOptionsModel) => {
  if (!(await isOpenApiSpecPlaceValidUtil(openApiSpecFilePathOrURL))) {
    signale.error('The OpenAPI file does not exist or the provided url is unreachable:', openApiSpecFilePathOrURL);
    return process.exit(1);
  }

  await writeSpecFile(openApiSpecFilePathOrURL);
  const serverConfig = await getServerConfig(options.serverConfig);
  const userConfigFile = join(process.cwd(), options.config);
  const devServer = await createServer({
    ...serverConfig,
    root: PUBLIC_PATH,
    resolve: {
      ...serverConfig.resolve,
      alias: {
        ...((serverConfig.resolve?.alias as Record<string, string>) || {}),
        '@user-config': existsSync(userConfigFile) ? userConfigFile : join(PUBLIC_PATH, 'swagger-ui.config'),
      },
    },
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
              copyFileSync(file, join(PUBLIC_PATH, 'spec.txt'));
            }
          });
        },
        // Prevent Vite from doing a full page reload when spec.txt changes,
        // since we handle updates via the custom WebSocket event above
        handleHotUpdate({file}: {file: string}) {
          if (file.endsWith('spec.txt')) return [];
        },
      },
    ],
  });

  await devServer.listen();

  const startedPort = devServer.config.server.port;
  if (startedPort !== options.port && startedPort !== serverConfig.server?.port)
    signale.warn(`Port already in use: ${options.port}. Using port: ${startedPort} instead.`);

  signale.success(`Server is running on http://${options.domain}:${devServer.config.server.port}`);
};
