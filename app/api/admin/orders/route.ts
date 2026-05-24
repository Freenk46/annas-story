import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../lib/supabase/server'
import type { OrderStatus } from '../../../../types/admin'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const { searchParams } = req.nextUrl
    const status    = searchParams.get('status')
    const page      = parseInt(searchParams.get('page') ?? '1')
    const limit     = parseInt(searchParams.get('limit') ?? '20')
    const offset    = (page - 1) * limit

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status as OrderStatus)
    }

    const { data, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, count, page, limit })
  })
}
