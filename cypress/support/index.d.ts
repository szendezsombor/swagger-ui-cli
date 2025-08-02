import {CliTaskArguments} from '../shared/models';

declare global {
  namespace Cypress {
    interface Chainable {
      cli(value: CliTaskArguments): Chainable;
      cliKill(): Chainable;
    }
  }
}
