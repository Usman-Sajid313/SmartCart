import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null; 
    const priceStr = formData.get('price') as string;
    const price = parseFloat(priceStr);
    const quantityStr = formData.get('quantity') as string;
    const quantity = parseInt(quantityStr, 10);
    const categoryIdStr = formData.get('category_id') as string;
    const category_id = parseInt(categoryIdStr, 10);
    const tagsStr = formData.get('tags') as string | null;
    let tags = null;
    if (tagsStr) {
      tags = tagsStr.split(',').map(tag => tag.trim());
    }
    const sellerIdStr = formData.get('seller_id') as string;
    const seller_id = parseInt(sellerIdStr, 10);
    const sizesRaw = formData.get('sizes') as string | null;
    let sizes = null;
    if (sizesRaw) {
      try {
        sizes = JSON.stringify(JSON.parse(sizesRaw));
      } catch (error) {
        console.error('Error parsing sizes JSON:', error);
      }
    }
    const condition = 'new';
    const insertProductQuery = `
      INSERT INTO products (name, description, price, stock_qty, condition, category_id, tags, seller_id, sizes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING product_id, name, description, price, stock_qty AS quantity, category_id, tags, sizes, condition, created_at, updated_at
    `;
    const productResult = await query(insertProductQuery, [
      name,
      description,
      price,
      quantity,
      condition,
      category_id,
      tags,
      seller_id,
      sizes,
    ]);
    const newProduct = productResult.rows[0];
    const product_id = newProduct.product_id;
    const imageFiles = formData.getAll('images');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating uploads directory:', err);
    }

    for (const file of imageFiles) {
      if (file instanceof File) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uniqueFilename = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadsDir, uniqueFilename);
        await fs.writeFile(filePath, buffer);
        await query(
          `INSERT INTO product_images (product_id, image_url)
           VALUES ($1, $2)`,
          [product_id, `/uploads/${uniqueFilename}`]
        );
      }
    }

    return NextResponse.json({ message: 'Product added successfully', product: newProduct });
  } catch (err) {
    console.error('Error adding product:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
