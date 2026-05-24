import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../../lib/supabase/server'
import type { OrderStatus } from '../../../../../types/admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })

    return NextResponse.json({ data })
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id }   = await params
    const { status } = await req.json() as { status: OrderStatus }

    if (!['new', 'processing', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  })
}
