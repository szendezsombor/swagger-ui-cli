#! /usr/bin/env node

import {program} from 'commander';
import {PACKAGE_NAME} from './shared';
import {createServeCommand} from './serve';

program.name(PACKAGE_NAME).description('This is a CLI tool bundle your openapi documentation or serve for live editing.').version('0.0.1');

createServeCommand();

program.parse();
