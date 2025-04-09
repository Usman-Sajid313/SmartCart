import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, name, description, price, quantity, category_id, tags, sizes } = body;
    
    if (!product_id) {
      return NextResponse.json({ error: 'Missing product_id' }, { status: 400 });
    }
    const updateQuery = `
      UPDATE products SET
        name = $2,
        description = $3,
        price = $4,
        stock_qty = $5,
        category_id = $6,
        tags = $7,
        sizes = $8::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $1
      RETURNING product_id, name, description, price, stock_qty AS quantity, category_id, tags, sizes, condition, created_at, updated_at
    `;
    const values = [
      product_id,
      name,
      description,
      price,
      quantity,
      category_id,
      tags,
      sizes ? JSON.stringify(sizes) : null,
    ];
    
    const result = await query(updateQuery, values);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product updated successfully', product: result.rows[0] });
  } catch (err) {
    console.error('Error editing product:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
