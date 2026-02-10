/*
This service should have express, cors and http-proxy-middleware installed as dependencies.
It will act as an API Gateway, routing requests to the appropriate microservices. In the real world, the other 
 microservices would not be reachable from the outside internet, but for now this will do.

The /api/test endpoint will try to reach every other stood up service and return their status to client.

*/

import express from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 8000;
const AUTH_SERVICE_ADDR = process.env.AUTH_SERVICE_ADDR || 'http://localhost:8000';

app.use(cors({
  origin: 'http://localhost:8080',  // vite dev server so that the client can access this API
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

async function forwardAuthRequest(req: express.Request, res: express.Response, path: string) {
  try {
    const authResponse = await fetch(`${AUTH_SERVICE_ADDR}${path}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body ?? {})
    });

    const responseText = await authResponse.text();
    const responseType = authResponse.headers.get('content-type') || '';
    res.status(authResponse.status);

    if (responseType.includes('application/json')) {
      res.type('application/json');
      try {
        res.send(JSON.parse(responseText));
        return;
      } catch {
        res.send(responseText);
        return;
      }
    }

    res.send(responseText);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reach auth service.';
    res.status(502).json({ ok: false, error: message });
  }
}

app.post('/api/auth/signup', async (req: express.Request, res: express.Response) => {
  await forwardAuthRequest(req, res, '/api/auth/signup');
});

app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  await forwardAuthRequest(req, res, '/api/auth/login');
});

const server = app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
process.on("SIGTERM", () =>  server.close());


//test endpoint
 app.get('/health', async (_req: express.Request, res: express.Response) => {
     const result: Record<string, string> = {};
     const services: string[] = Object.keys(process.env).filter((x) => /^.*_SERVICE_ADDR$/.test(x));
     console.log(services);

     for(const service of services) {
       const serviceAddress = process.env[service];
       if (!serviceAddress) {
         continue;
       }

       console.log(serviceAddress);
       const serviceName = service.split('_')[0];
       result[serviceName] = await fetch(`${serviceAddress}/health`)
         .then((res) => res.text())
         .catch((err) => err.message);
     }
     res.json(result);
  });
