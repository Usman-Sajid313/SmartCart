import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { items, shipping } = await req.json()

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart empty' }, { status: 400 })
  }
  const buyerId = req.headers.get('x-user-id')
  if (!buyerId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  const ids = items.map((i: any) => i.productId)
  const prodRes = await query(
    `SELECT product_id, price, seller_id FROM products WHERE product_id = ANY($1)`,
    [ids]
  )
  const map = new Map<number, { price: number; seller_id: number }>()
  for (let row of prodRes.rows) {
    map.set(row.product_id, { price: +row.price, seller_id: row.seller_id })
  }
  let total = 0
  const sellerTotals = new Map<number, number>()
  for (let it of items) {
    const m = map.get(it.productId)
    if (!m) {
      return NextResponse.json({ error: `Product ${it.productId} not found` }, { status: 400 })
    }
    const line = m.price * it.quantity
    total += line
    sellerTotals.set(m.seller_id, (sellerTotals.get(m.seller_id) || 0) + line)
  }
  await query('BEGIN')
  try {
    const bres = await query(
      `SELECT balance FROM users WHERE user_id = $1 FOR UPDATE`,
      [buyerId]
    )
    if (!bres.rows.length) throw new Error('Buyer missing')
    const bal = +bres.rows[0].balance
    if (bal < total) {
      await query('ROLLBACK')
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }
    await query(
      `UPDATE users SET balance = balance - $1 WHERE user_id = $2`,
      [total, buyerId]
    )
    for (let [sid, amt] of sellerTotals) {
      await query(
        `UPDATE users SET balance = balance + $1 WHERE user_id = $2`,
        [amt, sid]
      )
    }
    for (let it of items) {
      await query(
        `UPDATE products SET stock_qty = stock_qty - $1 WHERE product_id = $2`,
        [it.quantity, it.productId]
      )
    }
    await query('COMMIT')
    return NextResponse.json({ success: true, newBalance: bal - total })
  } catch (e: any) {
    console.error(e)
    await query('ROLLBACK')
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
