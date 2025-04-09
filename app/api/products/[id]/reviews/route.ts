import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: productId } = await params;
    const reviewsResult = await query(
      `
      SELECT 
        r.review_id AS id, 
        u.name AS "userName", 
        r.rating, 
        r.comment,
        to_char(r.review_date, 'Mon DD, YYYY') as date
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.product_id = $1
      ORDER BY r.review_date DESC
      `,
      [productId]
    );
    return NextResponse.json({ reviews: reviewsResult.rows || [] });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
