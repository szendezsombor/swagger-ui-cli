import {SwaggerUIOptions} from 'swagger-ui';
import {ServerOptions} from 'vite';

export type SwaggerUIConfigOptions = Omit<SwaggerUIOptions, 'dom_id'>;

export interface ServeConfig {
  server?: ServerOptions;
  config?: SwaggerUIConfigOptions;
}

export interface ServeOptionsModel {
  port: number;
  domain: string;
  config: string;
}
