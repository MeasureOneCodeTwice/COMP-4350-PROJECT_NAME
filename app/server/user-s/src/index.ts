import express from 'express';
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT} at http://localhost:${PORT}`);
});

//test endpoint
app.get('/api/test', (req: express.Request, res: express.Response) => {
    console.log('Received test request at User Service: ', req.url);
    res.send('ok');
});