import {program} from 'commander';
import {serve} from './serve';

// swagger-ui-cli serve <openapi-file> [options]
export const createServeCommand = () => {
  program
    .command('serve')
    .description('Serve out a swagger-ui instance for live editing.')
    .argument('<openapi-spec-file>', 'Path to the OpenAPI specification file.')
    .option('-p, --port <number>', 'Port to run the server on', parseInt, 8000)
    .option('-d, --domain <string>', 'Domain name to run on.', 'localhost')
    .action(serve);
};
