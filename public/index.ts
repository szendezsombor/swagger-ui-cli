// Load the Swagger UI library and its CSS
import 'swagger-ui/dist/swagger-ui.css';
import SwaggerUI from 'swagger-ui';

// Create a SwaggerUI instance with the OpenAPI specification
const swaggerUI = SwaggerUI({
  url: '/openapi.conf',
  dom_id: '#swagger-ui',
  deepLinking: true,
  layout: 'BaseLayout',
  presets: [SwaggerUI.presets.apis],
}) as SwaggerUI & {specActions: {updateSpec: (spec: string) => unknown}};

// Check if HMR is working with vite
if (import.meta.hot) {
  // Watch for changes to the OpenAPI file
  import.meta.hot.on('openapi-watch', (data: string) => swaggerUI.specActions.updateSpec(data));
}
