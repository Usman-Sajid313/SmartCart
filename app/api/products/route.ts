import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const pageParam = searchParams.get('page');
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = 8;
    const offset = (page - 1) * limit;

    if (!category) {
      return NextResponse.json({ products: [] });
    }

    const catQuery = `SELECT category_id FROM categories WHERE name ILIKE $1 LIMIT 1`;
    const catResult = await query(catQuery, [category]);
    if (catResult.rowCount === 0) {
      return NextResponse.json({ products: [] });
    }
    const catId = catResult.rows[0].category_id;

    const sql = `
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
      WHERE p.category_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const result = await query(sql, [catId, limit, offset]);
    return NextResponse.json({ products: result.rows });
  } catch (err) {
    console.error('Error fetching products by category:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
