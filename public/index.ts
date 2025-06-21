// Load the Swagger UI library and its CSS
import 'swagger-ui/dist/swagger-ui.css';
import SwaggerUI from 'swagger-ui';
import config from './swagger-ui.config';
import spec from './spec.txt?raw';

// Create a SwaggerUI instance with the OpenAPI specification
const swaggerUI = SwaggerUI({
  // Overridable options
  deepLinking: true,
  layout: 'BaseLayout',
  presets: [SwaggerUI.presets.apis],

  // User-defined configuration
  ...(config.config || {}),

  // Non overridable options
  dom_id: '#swagger-ui',
}) as SwaggerUI & {specActions: {updateSpec: (spec: string) => unknown}};

swaggerUI.specActions.updateSpec(spec);

// Check if HMR is working with vite
if (import.meta.hot) {
  // Watch for changes to the OpenAPI file
  import.meta.hot.on('openapi-watch', (data: string) => swaggerUI.specActions.updateSpec(data));
}
