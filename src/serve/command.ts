import {program} from 'commander';
import {serve} from './serve';

// swagger-ui-cli serve <openapi-file> [options]
export const createServeCommand = () => {
  program
    .command('serve')
    .description('Serve out a swagger-ui instance for live editing.')
    .argument('<openapi-spec-file>', 'Path to the OpenAPI specification file.')
    .option('-p, --port <number>', 'Port to run the server on', Number, 8000)
    .option('-d, --domain <string>', 'Domain name to run on.', 'localhost')
    .option('-c, --config <string>', 'Path to swagger-ui.config.js', 'swagger-ui.config.js')
    .action(serve);
};
