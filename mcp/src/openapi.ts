import swaggerJsdoc from 'swagger-jsdoc';
import mcpSchema from './schema.json';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MCP API',
      version: '1.0.0',
      description: 'API specification for the MCP server',
    },
    components: {
        schemas: {
          // Use your JSON schema directly as the MCPCommand schema
          ...mcpSchema.components.schemas,
        },
      },
  },
  apis: ['./src/mcp/routes.ts'], // Include your routes or JSDoc annotations here
};

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;
