import {SwaggerUIOptions} from 'swagger-ui';

export type SwaggerConfig = Omit<SwaggerUIOptions, 'url' | 'dom_id'>;

export interface ServeConfig {
  config?: SwaggerConfig;
}

export interface ServeOptionsModel {
  port: number;
  domain: string;
  config: string;
}
