import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../lib/supabase/server'
import type { TablesInsert } from '../../../../types/database'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const { searchParams } = req.nextUrl
    const category_id = searchParams.get('category_id')
    const is_active   = searchParams.get('is_active')
    const search      = searchParams.get('search')
    const page        = parseInt(searchParams.get('page') ?? '1')
    const limit       = parseInt(searchParams.get('limit') ?? '20')
    const offset      = (page - 1) * limit

    let query = supabase
      .from('products')
      .select('*, categories(name_ka)', { count: 'exact' })
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category_id) query = query.eq('category_id', category_id)
    if (is_active !== null) query = query.eq('is_active', is_active === 'true')
    if (search) query = query.ilike('name_ka', `%${search}%`)

    const { data, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, count, page, limit })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const body = await req.json() as TablesInsert<'products'>

    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data }, { status: 201 })
  })
}
