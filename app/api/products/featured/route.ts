import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const distinctProductsQuery = `
      WITH distinctProducts AS (
        SELECT DISTINCT ON (p.category_id)
          p.product_id AS id,
          p.name,
          p.price,
          COALESCE((
            SELECT image_url
            FROM product_images
            WHERE product_id = p.product_id
            LIMIT 1
          ), '') AS image,
          0 AS rating,
          0 AS reviews_count,
          p.stock_qty,
          p.category_id
        FROM products p
        ORDER BY p.category_id, random()
      ),
      distinctCount AS (
        SELECT COUNT(*) AS cnt FROM distinctProducts
      ),
      additionalProducts AS (
        SELECT 
          p.product_id AS id,
          p.name,
          p.price,
          COALESCE((
            SELECT image_url
            FROM product_images
            WHERE product_id = p.product_id
            LIMIT 1
          ), '') AS image,
          0 AS rating,
          0 AS reviews_count,
          p.stock_qty,
          p.category_id
        FROM products p
        WHERE p.product_id NOT IN (SELECT id FROM distinctProducts)
        ORDER BY random()
        LIMIT (8 - (SELECT cnt FROM distinctCount))
      )
      SELECT * FROM distinctProducts
      UNION ALL
      SELECT * FROM additionalProducts;
    `;

    const result = await query(distinctProductsQuery);
    return NextResponse.json({ products: result.rows });
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
