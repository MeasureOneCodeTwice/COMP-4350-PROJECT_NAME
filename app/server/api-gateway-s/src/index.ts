/*
This service should have express, cors and http-proxy-middleware installed as dependencies.
It will act as an API Gateway, routing requests to the appropriate microservices. In the real world, the other 
 microservices would not be reachable from the outside internet, but for now this will do.

The /api/test endpoint will try to reach every other stood up service and return their status to client.

*/

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;


interface Dictionary {
  [key: string]: string;
}

app.use(express.json());

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT} at http://localhost:${PORT}`);
});

//test endpoint
app.get('/api/test', async (req: express.Request, res: express.Response) => {
    console.log('Received test request at API Gateway: ', req.url);
    let output: Dictionary = {};

    output['api-gateway'] = `ok`;
    let services: string[] = ['analytics', 'user', 'authentication', 'market'];

    for (let i = 1; i < 5; i++) {
        // reach out to each microservice
        const service = services[i - 1];
        if (service) {
            try {
                const response = await fetch(`http://localhost:300${i}/api/test`);
                output[service] = await response.text();
            } catch (error) {
                output[service] = `error`;
            }
        }
    }
    res.json(output);
});
