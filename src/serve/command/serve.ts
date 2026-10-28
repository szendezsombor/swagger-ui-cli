import {createServer, CustomPayload, normalizePath, ViteDevServer} from 'vite';
import {ServeOptionsModel} from '../models';
import {readFileSync, writeFileSync, existsSync} from 'fs';
import signale from 'signale';
import {PUBLIC_PATH} from '../../public-path';
import {getServerConfig, writeSpecFile, isOpenApiSpecPlaceValidUtil} from '../utils';
import {isValidUrl} from '../utils/is-valid-url.util';
import {join, resolve} from 'node:path';

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
      include: [...(serverConfig.optimizeDeps?.include || []), 'swagger-ui-dist/swagger-ui-bundle.js'],
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
        configureServer({ws, watcher, middlewares}: ViteDevServer) {
          // Serve spec.txt directly from disk, bypassing Vite's transform cache
          middlewares.use((req, res, next) => {
            if (req.url === '/spec.txt') {
              res.setHeader('Content-Type', 'text/plain');
              res.setHeader('Cache-Control', 'no-store');
              res.end(readFileSync(join(PUBLIC_PATH, 'spec.txt'), {encoding: 'utf-8'}));
              return;
            }
            next();
          });

          // A spec loaded from a URL has no file to watch
          if (isValidUrl(openApiSpecFilePathOrURL)) return;

          const specPath = normalizePath(resolve(openApiSpecFilePathOrURL));
          const isSpec = (file: string) => normalizePath(resolve(file)) === specPath;

          // Keep spec.txt in sync for page reloads, then send the new spec to the client
          const updateSpec = (file: string) => {
            if (!isSpec(file)) return;
            const spec = readFileSync(file, {encoding: 'utf-8'});
            // Editors and generators may empty the file before writing it, skip that state
            if (!spec.trim()) return;
            writeFileSync(join(PUBLIC_PATH, 'spec.txt'), spec);
            ws.send({type: 'custom', event: 'openapi-watch', data: spec} as CustomPayload);
          };

          // Add the OpenAPI to watcher, for live updates
          watcher.add(specPath);
          watcher.on('change', updateSpec);
          // A spec that is deleted and written again comes back as 'add'
          watcher.on('add', updateSpec);
          // A polling watcher stops watching a deleted file, so watch it again
          watcher.on('unlink', file => {
            if (!isSpec(file)) return;
            watcher.add(specPath);
            if (existsSync(specPath)) updateSpec(specPath);
          });
        },
        // Prevent Vite from doing a full page reload when spec.txt changes,
        // but invalidate the module cache so reloads get the latest version
        handleHotUpdate({file, server}: {file: string; server: ViteDevServer}) {
          if (file.endsWith('spec.txt')) {
            const mod = server.moduleGraph.getModulesByFile(file);
            if (mod) mod.forEach(m => server.moduleGraph.invalidateModule(m));
            return [];
          }
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
