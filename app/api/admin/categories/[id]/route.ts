import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../../lib/supabase/server'
import type { TablesUpdate } from '../../../../../types/database'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const body   = await req.json() as TablesUpdate<'categories'>

    const { data, error } = await supabase
      .from('categories')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  })
}
