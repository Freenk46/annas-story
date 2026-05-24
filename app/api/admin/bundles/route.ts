import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../lib/supabase/server'
import type { TablesInsert } from '../../../../types/database'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const { data, error } = await supabase
      .from('bundles')
      .select('*, bundle_products(product_id, quantity, products(name_ka, price))')
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const { product_ids, ...body } = await req.json() as TablesInsert<'bundles'> & { product_ids?: string[] }

    const { data, error } = await supabase
      .from('bundles')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (product_ids?.length) {
      const rows = product_ids.map(pid => ({ bundle_id: data.id, product_id: pid, quantity: 1 }))
      await supabase.from('bundle_products').insert(rows)
    }

    return NextResponse.json({ data }, { status: 201 })
  })
}
