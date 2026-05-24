import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth } from '../../../../lib/supabase/server'
import { createAdminClient } from '../../../../lib/supabase/admin'

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const formData = await req.formData()
    const file     = formData.get('file') as File | null
    const bucket   = formData.get('bucket') as string | null

    if (!file)   return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!bucket) return NextResponse.json({ error: 'No bucket specified' }, { status: 400 })
    if (!['products', 'categories'].includes(bucket)) {
      return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
    }

    const supabase  = createAdminClient()
    const ext       = file.name.split('.').pop() ?? 'jpg'
    const filename  = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const bytes     = await file.arrayBuffer()

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, bytes, { contentType: file.type, upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ url: publicUrl, path: filename })
  })
}
