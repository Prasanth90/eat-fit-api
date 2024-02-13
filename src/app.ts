import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

import compressFilter from './utils/compressFilter.util';
import config from './config/config';

import { auth } from 'express-oauth2-jwt-bearer';
import buildRestaurantRoutes from './routes/restaurants';

const jwtCheck = auth({
  audience: config.audience,
  issuerBaseURL: config.issuer_base_url,
  tokenSigningAlg: 'RS256',
});

console.log(jwtCheck);

const app: Express = express();

app.use(
  cors({
    // origin is given a array if we want to have multiple origins later
    origin: [config.cors_origin, config.fe_base_url],
    credentials: true,
  })
);

// Helmet is used to secure this app by configuring the http-header
app.use(helmet());

// Compression is used to reduce the size of the response body
app.use(compression({ filter: compressFilter }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

buildRestaurantRoutes(app);

export default app;
