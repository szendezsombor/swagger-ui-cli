# Swagger UI CLI

[![Package lint](https://github.com/szendezsombor/swagger-ui-cli/actions/workflows/code-check.yaml/badge.svg)](https://github.com/szendezsombor/swagger-ui-cli/actions/workflows/code-check.yaml)
[![Build and Release](https://github.com/szendezsombor/swagger-ui-cli/actions/workflows/build-and-release.yaml/badge.svg)](https://github.com/szendezsombor/swagger-ui-cli/actions/workflows/build-and-release.yaml)
[![Discord](https://dcbadge.limes.pink/api/server/9GNSXb5V?style=flat)](https://discord.gg/9GNSXb5V)

This CLI tool is designed to **serve and live-reload an OpenAPI specification file** during development, and also to **build a static HTML page** from your OpenAPI spec file.

## Usage

### Build

This command will build a static HTML page from your OpenAPI specification file.

```bash
swagger-ui-cli build <openapi-file | openapi-url>
```

#### Options

- `--output`: Output folder name. Default is `dist`.
- `--multiFileBuild`: Should output multiple files instead of single index.html. Default is `false`.
- `--config`: Path to the configuration file, there you can configure the [swagger-ui](https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md). Default is `swagger-ui.config.js`.

### Serve

This command will open a live reloading server, if you change your config it will change the page.

```bash
swagger-ui-cli serve <openapi-file | openapi-url>
```

#### Options

- `--port`: The port to serve the Swagger UI on. Default is `8000`.
- `--domain`: The domain to serve the Swagger UI on. Default is `localhost`.
- `--config`: Path to the configuration file, there you can configure the [swagger-ui](https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md) and also the [dev server](https://vite.dev/config/server-options). Default is `swagger-ui.config.js`.

### swagger-ui.config.js

```javascript
export default {
  server: {
    // Under the hood there is a simple vite server running, so you can use any vite server options here. https://vite.dev/config/server-options
    port: 1234,
  },
  config: {
    // For more please visit the official site: https://github.com/swagger-api/swagger-ui/blob/HEAD/docs/usage/configuration.md
    docExpansion: 'none',
    deepLinking: true,
    displayOperationId: true,
    defaultModelsExpandDepth: -1,
    showExtensions: true,
    showCommonExtensions: true,
    filter: true,
    onComplete: () => console.log('swagger can run'),
  },
};
```
