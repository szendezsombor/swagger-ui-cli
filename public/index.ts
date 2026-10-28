// Load the Swagger UI library and its CSS
import 'swagger-ui-dist/swagger-ui.css';
import SwaggerUI from 'swagger-ui-dist/swagger-ui-bundle.js';
import config from '@user-config';

// Serve fetches the spec from disk on every load (bypasses Vite transform cache), the static build bundles it in.
// It is loaded before Swagger UI starts, otherwise the page flashes "No API definition provided."
const spec = import.meta.env.DEV ? await fetch('/spec.txt').then(r => r.text()) : (await import('./spec.txt?raw')).default;

// Create a SwaggerUI instance with the OpenAPI specification
const swaggerUI = SwaggerUI({
  // Overridable options
  deepLinking: true,
  layout: 'BaseLayout',
  presets: [SwaggerUI.presets.apis],

  // User-defined configuration
  ...(config || {}),

  // Non overridable options
  dom_id: '#swagger-ui',
}) as SwaggerUI & {specActions: {updateSpec: (spec: string) => unknown}};

swaggerUI.specActions.updateSpec(spec);

// Check if HMR is working with vite
if (import.meta.hot) {
  // Watch for changes to the OpenAPI file
  import.meta.hot.on('openapi-watch', (data: string) => swaggerUI.specActions.updateSpec(data));
}
