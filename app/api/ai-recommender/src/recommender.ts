import fs from 'fs';
import { parse } from 'csv-parse/sync';
import natural from 'natural';
import cosineSimilarity from 'cosine-similarity';

type Product = {
  product_id: number;
  title: string;
  description: string;
  category: string;  
};

export class ProductRecommender {
  private products: Product[] = [];
  private tfidf = new natural.TfIdf();

  constructor(csvPath: string) {
    const data = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(data, {
      columns: true,
      skip_empty_lines: true,
    });

    
    this.products = records.map((r: any) => ({
      product_id: parseInt(r.product_id),  
      title: r.Name,  
      description: r.Description,  
      category: r.Category,  
    }));

    this.products.forEach((p) => this.tfidf.addDocument(p.description));
  }

  recommend(productId: number, topN: number = 3): Product[] {
    const targetIndex = this.products.findIndex(p => p.product_id === productId);
    if (targetIndex === -1) return [];

    const targetProduct = this.products[targetIndex];
    const targetCategory = targetProduct.category;  

    const targetVector = this.getTfidfVector(targetIndex);
    const similarities = this.products.map((_, i) => {
      const vec = this.getTfidfVector(i);
      return cosineSimilarity(targetVector, vec);
    });

    
    const scored = similarities
      .map((score, index) => ({ score, index }))
      .filter(entry => entry.index !== targetIndex)  
      .filter(entry => this.products[entry.index].category === targetCategory)  
      .sort((a, b) => b.score - a.score)  
      .slice(0, topN)  
      .map(entry => this.products[entry.index]);  

    return scored;
  }

  private getTfidfVector(index: number): number[] {
    const vector: number[] = [];
    const terms = this.tfidf.listTerms(index);
    for (const term of terms) {
      vector.push(term.tfidf);
    }
    return vector;
  }
}
