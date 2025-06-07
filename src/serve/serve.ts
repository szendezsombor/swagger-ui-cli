import {createServer, CustomPayload, ViteDevServer} from 'vite';
import {ServeOptionsModel} from './models';
import {readFileSync, copyFileSync} from 'fs';
import signale from 'signale';
import {PUBLIC_PATH} from '../public-path';

export const serve = async (openapiFilePath: string, options: ServeOptionsModel) => {
  const devServer = await createServer({
    root: PUBLIC_PATH,
    server: {
      port: options.port,
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

  signale.success(`Server is running on http://${options.domain}:${options.port}`);
};
