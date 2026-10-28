// swagger-ui-dist has no types, but its bundle has the same API as swagger-ui
declare module 'swagger-ui-dist/swagger-ui-bundle.js' {
  import SwaggerUI from 'swagger-ui';
  export default SwaggerUI;
}
