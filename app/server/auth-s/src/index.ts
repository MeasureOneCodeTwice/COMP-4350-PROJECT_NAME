import express from 'express';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Authentication Service running on port ${PORT} at http://localhost:${PORT}`);
});

//test endpoint
app.get('/api/test', (req: express.Request, res: express.Response) => {
    console.log('Received test request at Authentication Service: ', req.url);
    res.send('ok');
});