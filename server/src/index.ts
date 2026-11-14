import express from 'express';
import cors from 'cors';
import { db } from './prisma/db.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'YŌJU GUITARS API',
  });
});

app.get('/products', async (_req, res) => {
  try {
    const products = await db.orm.public.Product
      .include('images', (image) =>
        image
          .select('imageUrl', 'sortOrder')
          .orderBy((image) => image.sortOrder.asc())
      )
      .all();

    const result = products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.imageUrl),
    }));

    res.status(200).json({
      items: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      type: 'internal-server-error',
      title: 'Internal Server Error',
      status: 500,
    });
  }
});

app.listen(PORT, () => {
  console.log(`YŌJU GUITARS API is running on http://localhost:${PORT}`);
});