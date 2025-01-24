import swaggerAutogen from 'swagger-autogen';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = {
  info: {
    title: 'IMF Gadget Management API',
    description: 'API for managing IMF gadgets and equipment'
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Bearer token authorization'
    }
  },
  security: [{ bearerAuth: [] }]
};

const outputFile = join(__dirname, 'swagger-output.json');
const endpointsFiles = ['./src/index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);