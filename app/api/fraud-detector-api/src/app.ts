import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { predictFraud } from './fraudPredictor';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/check-fraud', async (req, res) => {
  try {
    const result = await predictFraud(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Prediction failed', details: err });
  }
});

app.listen(3001, () => console.log('🚀 ML-based fraud detection API running on http://localhost:3001'));
