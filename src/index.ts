#! /usr/bin/env node

import {program} from 'commander';
import {PACKAGE_NAME} from './shared';
import {createServeCommand, ServerConfig, ClientConfig, serve} from './serve';
import {createBuildCommand} from './build';

program.name(PACKAGE_NAME).description('This is a CLI tool bundle your openapi documentation or serve for live editing.').version('0.0.5');

createServeCommand();
createBuildCommand();

program.parse();

export {serve};
export type {ServerConfig, ClientConfig};
