import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { gadgetRoutes } from './routes/gadgets.js';
import { authRoutes } from './routes/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerFile = JSON.parse(
  readFileSync(join(__dirname, 'swagger-output.json'), 'utf8')
);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
  }).unless({
    path: [
        '/',
      '/auth/login',
      '/auth/register',
      '/api-docs/',
      '/api-docs',
      '/api-docs/#/',
      '/api-docs/swagger-ui.css',
      '/api-docs/swagger-ui-bundle.js',
      '/api-docs/swagger-ui-standalone-preset.js',
      '/api-docs/swagger-ui-init.js',
      '/api-docs/swagger-ui-wrapper.js',
      '/api-docs/swagger-ui.css.map',
    ],
  })
);

// Routes
app.use('/auth', authRoutes);
app.use('/gadgets', gadgetRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`IMF Gadget API running on port ${port}`);
});
