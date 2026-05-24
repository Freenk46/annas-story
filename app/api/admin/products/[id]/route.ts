import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../../lib/supabase/server'
import type { TablesUpdate } from '../../../../../types/database'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name_ka)')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })

    return NextResponse.json({ data })
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (supabase) => {
    const { id } = await params
    const body   = await req.json() as TablesUpdate<'products'>

    const { data, error } = await supabase
      .from('products')
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
    const { id }   = await params
    const { searchParams } = req.nextUrl
    const hard     = searchParams.get('hard') === 'true'

    if (hard) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  })
}
