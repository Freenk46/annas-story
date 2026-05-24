import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../lib/supabase/server'
import type { TablesInsert } from '../../../../types/database'

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (supabase) => {
    const body = await req.json() as TablesInsert<'categories'>

    const { data, error } = await supabase
      .from('categories')
      .insert(body)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data }, { status: 201 })
  })
}
