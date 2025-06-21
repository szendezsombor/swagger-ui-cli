import {program} from 'commander';
import {build} from './build';

export const createBuildCommand = () => {
  program
    .command('build')
    .description('Generates a static HTML+JS out file from the OpenAPI documentation that can be served as a standalone page.')
    .argument('<openapi-spec-file>', 'Path to the OpenAPI specification file or the url where the spec file can be found.')
    .option('-c, --config <string>', 'Path to swagger-ui.config.js', 'swagger-ui.config.js')
    .option('-o, --output <string>', 'Output folder name', 'dist')
    .option('-m, --multiFileBuild <string>', 'Should output multiple files instead of single index.html', Boolean, false)
    .action(build);
};
