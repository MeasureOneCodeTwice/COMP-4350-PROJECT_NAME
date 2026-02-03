/*
This service should have express, cors and http-proxy-middleware installed as dependencies.
It will act as an API Gateway, routing requests to the appropriate microservices. In the real world, the other 
 microservices would not be reachable from the outside internet, but for now this will do.

The /api/test endpoint will try to reach every other stood up service and return their status to client.

*/

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

interface Dictionary {
  [key: string]: string;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',  // vite dev server so that the client can access this API
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const runningOnDocker = process.env.DOCKER_ENV === 'true';



app.use(express.json());

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} at http://localhost:${PORT}, Running on Docker: ${runningOnDocker}`);
});



//test endpoint
app.get('/api/test', async (req: express.Request, res: express.Response) => {
    console.log('Received test request at API Gateway: ', req.url);
    let output: Dictionary = {};

    output['api-gateway'] = `ok`;
    let services: string[] = ['analytics', 'user', 'authentication', 'market'];

    if (runningOnDocker) {
        services = [ 'auth-s', 'user-s', 'analytics-s', 'market-s'];
    }

    for (let i = 1; i < 5; i++) {
        // reach out to each microservice
        const service = services[i - 1];
        if (service) {
            try {
                if (!runningOnDocker) {
                    const response = await fetch(`http://localhost:300${i}/api/test`);
                    output[service] = await response.text();
                } else {
                    const response = await fetch(`http://${service}:300${i}/api/test`);
                    output[service] = await response.text();
                }
            } catch (error) {
                output[service] = `error`;
                console.log(error);
            }
        }
    }
    res.json(output);
});
