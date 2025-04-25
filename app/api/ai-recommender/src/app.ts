import express from 'express';
import bodyParser from 'body-parser';
import { ProductRecommender } from './recommender.js';

const app = express();
const port = 3000;


app.use(bodyParser.json());

const recommender = new ProductRecommender('./src/products.csv');


app.get('/', (req, res) => {
  res.send('🎉 Product Recommender API is running!');
});


app.get('/recommendations', (req, res) => {
  const productId = parseInt(req.query.product_id as string);
  const topN = parseInt((req.query.top_n as string) || '3');

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Invalid product_id' });
  }

  const recommendations = recommender.recommend(productId, topN);
  res.json(recommendations);
});


app.post('/recommend', (req, res) => {
  const { product_id, top_n } = req.body;

  if (typeof product_id !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing product_id in request body' });
  }

  const topN = typeof top_n === 'number' ? top_n : 3;
  const recommendations = recommender.recommend(product_id, topN);
  res.json(recommendations);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Recommender API running at http://localhost:${port}`);
});
