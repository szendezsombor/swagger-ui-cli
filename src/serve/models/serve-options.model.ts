import {SwaggerUIOptions} from 'swagger-ui';
import {InlineConfig} from 'vite';

export type SwaggerUIConfigOptions = Omit<SwaggerUIOptions, 'dom_id'>;

export type ServerConfig = InlineConfig;
export type ClientConfig = SwaggerUIConfigOptions;

export interface ServeOptionsModel {
  port: number;
  domain: string;
  config: string;
  serverConfig: string;
}
