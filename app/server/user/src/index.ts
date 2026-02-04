import express from 'express';
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
process.on("SIGTERM", () =>  server.close());

//test endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
    res.send('ok');
});
