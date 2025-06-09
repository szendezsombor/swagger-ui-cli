import {createServer, CustomPayload, ViteDevServer} from 'vite';
import {ServeOptionsModel} from './models';
import {readFileSync, copyFileSync} from 'fs';
import signale from 'signale';
import {PUBLIC_PATH} from '../public-path';
import {getConfig, handleConfigFileReplacement} from './utils';

export const serve = async (openapiFilePath: string, options: ServeOptionsModel) => {
  handleConfigFileReplacement(options.config);
  const config = await getConfig(options.config);
  const devServer = await createServer({
    root: PUBLIC_PATH,
    optimizeDeps: {
      include: ['swagger-ui'],
    },
    server: {
      host: options.domain,
      port: options.port,
      allowedHosts: [options.domain],
      ...(config.server || {}),
    },
    plugins: [
      {
        name: 'openapi-file-watch',
        configureServer({ws, watcher, middlewares}: ViteDevServer) {
          // Serve the OpenAPI file at /openapi.conf
          middlewares.use((req, res, next) => {
            if (req.url === '/openapi.conf') {
              res.end(readFileSync(openapiFilePath, {encoding: 'utf-8'}));
            } else {
              next();
            }
          });

          // Add the OpenAPI to watcher, for live updates
          watcher.add(openapiFilePath);

          const specFileName = openapiFilePath.split('/').pop() || 'openapi.yaml';

          // Watch for changes to the OpenAPI file and send updates to the client
          watcher.on('change', (file: string) => {
            if (file.endsWith(specFileName)) {
              ws.send({
                type: 'custom',
                event: 'openapi-watch',
                data: readFileSync(file, {encoding: 'utf-8'}),
              } as CustomPayload);
              copyFileSync(file, openapiFilePath);
            }
          });
        },
      },
    ],
  });

  await devServer.listen();

  const startedPort = devServer.config.server.port;
  if (startedPort !== options.port) signale.warn(`Port already in use: ${options.port}. Using port: ${startedPort} instead.`);

  signale.success(`Server is running on http://${options.domain}:${devServer.config.server.port}`);
};
