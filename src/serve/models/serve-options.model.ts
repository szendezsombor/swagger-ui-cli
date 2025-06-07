import {SwaggerUIOptions} from 'swagger-ui';

export type SwaggerConfig = Omit<SwaggerUIOptions, 'url' | 'dom_id'>;

export interface ServeConfig {
  port: number;
  domain: string;
  swaggerConfig: SwaggerConfig;
}

export interface ServeOptionsModel {
  port: number;
  domain: string;
  openApiConfigPath: string;
  serveConfigPath: string;
}
