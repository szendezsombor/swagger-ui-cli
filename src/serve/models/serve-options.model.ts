import {SwaggerUIOptions} from 'swagger-ui';
import {InlineConfig} from 'vite';

export type SwaggerUIConfigOptions = Omit<SwaggerUIOptions, 'dom_id'>;

export type ServerConfig = InlineConfig;
export type ClientConfig = SwaggerUIConfigOptions;

export interface ServeOptionsModel {
  /**
   * Port number for the dev server to listen on.
   */
  port: number;

  /**
   * Hostname for the dev server (e.g. "localhost").
   */
  domain: string;

  /**
   * Path to the Swagger UI client configuration file.
   * (SwaggerUIOptions overrides)
   */
  config: string;

  /**
   * Path to the Vite server configuration file.
   * (InlineConfig overrides)
   */
  serverConfig: string;
}
