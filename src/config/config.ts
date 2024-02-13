import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const config = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  cors_origin: process.env.CORS_ORIGIN,
  mongo_url: process.env['MONGO_URL'] || '',
  mongo_username: process.env['MONGO_USERNAME'] || '',
  mongo_password: process.env['MONGO_PASSWORD'] || '',
  fe_base_url: process.env['AUTH0_BASE_URL'] || '',
  issuer_base_url: process.env['ISSUER_BASE_URL'] || '',
  audience: process.env['AUTH0_AUDIENCE'] || '',
};

export default config;
