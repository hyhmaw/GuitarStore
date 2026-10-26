import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'YŌJU GUITARS API',
  });
});

app.listen(PORT, () => {
  console.log(`YŌJU GUITARS API is running on http://localhost:${PORT}`);
});