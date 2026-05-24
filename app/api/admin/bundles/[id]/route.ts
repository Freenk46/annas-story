import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../../lib/supabase/server'
import type { TablesUpdate } from '../../../../../types/database'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const { data, error } = await supabase
      .from('bundles')
      .select('*, bundle_products(product_id, quantity, products(name_ka, price))')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })

    return NextResponse.json({ data })
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const { product_ids, ...body } = await req.json() as TablesUpdate<'bundles'> & { product_ids?: string[] }

    const { data, error } = await supabase
      .from('bundles')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (product_ids !== undefined) {
      await supabase.from('bundle_products').delete().eq('bundle_id', id)
      if (product_ids.length) {
        const rows = product_ids.map(pid => ({ bundle_id: id, product_id: pid, quantity: 1 }))
        await supabase.from('bundle_products').insert(rows)
      }
    }

    return NextResponse.json({ data })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const { error } = await supabase.from('bundles').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  })
}
